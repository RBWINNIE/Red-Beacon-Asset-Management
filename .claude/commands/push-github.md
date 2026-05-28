# Push to GitHub

Perform a full GitHub publish: secrets scan → README update → code push → repo About update.

## Steps

### 1. Scan for secrets and API keys

Before touching git, search the entire working tree for secrets. Check for:
- Hardcoded API keys, tokens, passwords, or secrets in any file under `apex-asset-website/`
- Patterns like `api_key`, `apiKey`, `secret`, `password`, `token`, `Bearer`, `sk-`, `ghp_`, `AIza`, email addresses used as credentials
- Any `.env` files or config files containing credentials

If any secrets are found:
- Stop immediately and report exactly which file and line contains the secret
- Do NOT proceed with the push until the user confirms it has been removed or is safe to expose
- Suggest replacing hardcoded values with placeholders (e.g. `your-email@example.com`)

Also ensure `.gitignore` exists and covers common secret files. If it doesn't exist, create one at the repo root with:
```
.env
.env.*
*.env
secrets.*
config.local.*
```

### 2. Update README.md

Rewrite `README.md` at the repo root to reflect the current state of the project. The README must include:
- Project name and one-line description
- Live site URL: `https://rbwinnie.github.io/Red-Beacon-Asset-Management/`
- Project structure (files and their roles)
- Sections of the site (what each section does)
- How to run locally
- How to deploy updates (the `git subtree push` workflow)
- Contact form setup instructions (FormSubmit activation)

Base all content on what is actually in the files — read `index.html`, `styles.css`, and `script.js` before writing so the README is accurate.

### 3. Push code to GitHub

Run these git commands (refresh PATH first so git is found):
```powershell
$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")
cd "c:\Users\winnie.koh\Documents\Asset Management"
git add -A
git status
git commit -m "<concise commit message describing what changed>"
git push origin main
```

Write the commit message based on what files actually changed (`git status` output). If there is nothing to commit, skip the commit step and say so.

After pushing main, also sync the live site to the `gh-pages` branch:
```powershell
git subtree push --prefix apex-asset-website origin gh-pages
```

### 4. Update repo About via GitHub API

Use the stored Windows Credential Manager token to update the repository About section on GitHub. The About section includes the description, website URL, and topics.

Retrieve the token using this .NET snippet (reuse the CredMan class pattern from prior sessions — define a uniquely named class each time to avoid redefinition errors):

```powershell
Add-Type -TypeDefinition @'
using System; using System.Runtime.InteropServices; using System.Text;
public class CredManCmd {
    [DllImport("advapi32.dll", CharSet=CharSet.Unicode, SetLastError=true)]
    static extern bool CredRead(string target, uint type, uint flags, out IntPtr ptr);
    [DllImport("advapi32.dll")] static extern void CredFree(IntPtr ptr);
    [StructLayout(LayoutKind.Sequential, CharSet=CharSet.Unicode)]
    struct CREDENTIAL { public uint Flags,Type; public string TargetName,Comment; public System.Runtime.InteropServices.ComTypes.FILETIME LastWritten; public uint CredentialBlobSize; public IntPtr CredentialBlob; public uint Persist; public uint AttributeCount; public IntPtr Attributes; public string TargetAlias,UserName; }
    public static string GetPassword(string target) {
        IntPtr ptr; if (!CredRead(target,1,0,out ptr)) return null;
        var c = Marshal.PtrToStructure<CREDENTIAL>(ptr); var bytes = new byte[c.CredentialBlobSize];
        Marshal.Copy(c.CredentialBlob, bytes, 0, bytes.Length); CredFree(ptr); return Encoding.Unicode.GetString(bytes);
    }
}
'@ -ErrorAction SilentlyContinue
$token = [CredManCmd]::GetPassword("git:https://github.com")
```

Then call the GitHub API to update the repo:
```powershell
$headers = @{ "Authorization" = "token $token"; "Accept" = "application/vnd.github+json"; "User-Agent" = "PowerShell" }
$body = @{
    description = "Static one-page website for Red Beacon Asset Management — wealth management and investment advisory."
    homepage    = "https://rbwinnie.github.io/Red-Beacon-Asset-Management/"
    topics      = @("asset-management","wealth-management","static-site","github-pages")
} | ConvertTo-Json
Invoke-RestMethod -Uri "https://api.github.com/repos/RBWINNIE/Red-Beacon-Asset-Management" -Method PATCH -Headers $headers -Body $body -ContentType "application/json"
```

Update `topics` to reflect the actual tech and domain of the site. Update `description` if the site content has changed.

## Done

Report:
- Any secrets found (and whether push was blocked)
- What changed in the README
- The commit hash and what was pushed
- Confirmation that gh-pages was updated (or if it was skipped because nothing changed)
- Confirmation that the repo About was updated
