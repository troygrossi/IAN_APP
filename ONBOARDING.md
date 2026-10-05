# Onboarding

A checklist that takes you from a brand-new Windows or Mac computer to the app running and your first change saved. Work from the top. Tick a box by changing `[ ]` to `[x]`, or just keep your place.

**On a Mac:** where a step differs, it has a line that starts with "On a Mac". The double-click files end in `.command` instead of `.cmd`: wherever a step names `Doctor.cmd`, double-click `Doctor.command`.

It takes about an hour, most of it waiting for installers.

**You do not have to judge whether a step worked.** From step 10 on, the doctor checks your computer and tells you which step still needs attention, with the link. Each step below says what the doctor shows when it is done.

Words you do not know are explained in [HELP.md](HELP.md), section 10.

## What you will end up with

| Thing | What it is for | Cost |
| --- | --- | --- |
| A GitHub account | Keeps the project and its history online | Free |
| A Vercel account | Hosts the live site | Free |
| A Supabase account | Hosts the database | Free |
| Git | The program that keeps the history of your work | Free |
| Node | The program that runs the app on your computer | Free |
| VS Code | The editor: where you look at and change files | Free |
| Claude Code | The coding agent that does most of the typing | Needs a Claude plan |

## Part 1: Accounts

Use the same email address for all three. It keeps things simple.

### Step 1: GitHub account

- [ ] Create an account at https://github.com/signup
- [ ] Send your GitHub username to Troy, so he can give you access to the project
- [ ] Accept the invitation. It arrives by email and at https://github.com/notifications

Done when: you can open https://github.com/troygrossi/IAN_APP while signed in. Later, the doctor says "GitHub: this computer can reach the project".

### Step 2: Vercel account

- [ ] Create an account at https://vercel.com/signup and choose **Continue with GitHub**
- [ ] Tell Troy the email address you used

Done when: you can sign in at https://vercel.com. The doctor cannot see your account; it checks that the live site answers instead.

You do not need Vercel to work on the app. You need it to look at the live site's build logs when a deploy fails.

### Step 3: Supabase account

- [ ] Create an account at https://supabase.com/dashboard and choose **Continue with GitHub**
- [ ] Tell Troy the email address you used, so he can add you to the project

Done when: you can see the project in your Supabase dashboard. Later, the doctor says "Supabase: the database answers".

## Part 2: Programs

Install these in order. For each one, download the installer, open it, and accept the suggested options unless a step says otherwise.

### Step 4: Git

- [ ] Download from https://git-scm.com/download/win and run the installer
- [ ] Accept the suggested options on every screen. There are many screens; the suggestions are fine

On a Mac, do these instead. Git comes from Apple, and a second small program signs it in to GitHub:

- [ ] Open the Terminal: press `Cmd` + `Space`, type `Terminal`, press Enter
- [ ] Run `xcode-select --install` and choose **Install**. It takes a few minutes. If it says the tools are "already installed", that is fine
- [ ] Download the Mac installer of the GitHub CLI from https://cli.github.com and run it
- [ ] Close the Terminal, open it again, and run `gh auth login`. Choose **GitHub.com**, then **HTTPS**, answer **Yes** to "Authenticate Git", and choose **Login with a web browser**

Done when: the doctor's Git check stops saying "Git is not installed".

### Step 5: Node

- [ ] Download the **LTS** version from https://nodejs.org and run the installer
- [ ] Accept the suggested options. You do not need the optional "tools for native modules"

Done when: the doctor says "Node" with a green tick.

### Step 6: VS Code

- [ ] Download from https://code.visualstudio.com and run the installer
- [ ] On the "Select Additional Tasks" screen, tick both **"Open with Code"** boxes. They let you right-click a folder and open it

On a Mac there is no installer: open the download and drag **Visual Studio Code** into the **Applications** folder.

Done when: the doctor says "VS Code is installed".

### Step 7: Claude Code

- [ ] Install it from https://claude.com/claude-code and sign in

Done when: the doctor says "Claude Code is installed". If you use the Claude desktop app instead, the doctor will not find it; that is fine, this check is optional.

### Restart

- [ ] Restart the computer. Windows only notices newly installed programs in windows opened after the install, and a restart is the simplest way to be sure. On a Mac, closing the Terminal and opening it again is enough

## Part 3: The project

### Step 8: Tell Git who you are

Git puts a name on every version you save. Open the **Start** menu, type `cmd`, press Enter (on a Mac: open the Terminal, as in step 4), and run these two lines with your own name and the email you used for GitHub:

```
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

- [ ] Both lines run without an error (they print nothing)

Done when: the doctor says "Git knows your name and email".

### Step 9: Get the project

In the same window, go to the folder where you want the project, then copy it down from GitHub:

```
cd %USERPROFILE%\Desktop
git clone -b develop https://github.com/troygrossi/IAN_APP.git
```

On a Mac, the first line is `cd ~/Desktop` instead. If the Mac asks whether Terminal may access your Desktop folder, choose **Allow**.

- [ ] A browser window opens and asks you to sign in to GitHub. Sign in and choose **Authorize**. On a Mac this does not appear, because you signed in at step 4
- [ ] A folder named `IAN_APP` appears on your Desktop

If it says "Repository not found", you have not accepted the invitation from step 1 yet. If a Mac asks for a username and password here, stop with `Ctrl` + `C` and finish the `gh auth login` line in step 4 first.

### Step 10: Run the doctor

- [ ] Open the `IAN_APP` folder and double-click **`Doctor.cmd`**

If Windows shows a blue "Windows protected your PC" box, choose **More info**, then **Run anyway**. It appears because the file came from the internet.

On a Mac, double-click **`Doctor.command`**. If the Mac says it "cannot be opened", right-click the file, choose **Open**, then **Open** again.

The first run takes a minute: it installs the code the app is built on and creates your settings file, `.env.local`.

- [ ] Read the result. Green ticks are done. Each yellow or red line ends with the step in this file that fixes it

Done when: the last line says "ready". Yellow lines about the database are expected until step 11.

### Step 11: Connect the database

The app needs the address of the database. It contains a password, so it is never saved to GitHub; you put it in your own `.env.local`.

- [ ] Get the address. Either ask Troy to send it to you privately, or copy it from Supabase: open the project, click **Connect**, and copy the **Transaction pooler** address, replacing `[YOUR-PASSWORD]` with the database password
- [ ] In the `IAN_APP` folder, right-click `.env.local` and choose **Open with Code**. On a Mac, Finder hides this file: open VS Code, choose **File**, then **Open Folder…**, pick `IAN_APP`, and click `.env.local` in the list on the left
- [ ] Paste the address directly after `DATABASE_URL=` with no spaces, and save the file
- [ ] Double-click **`Doctor.cmd`** again

Done when: the doctor says "Connected to the database" and "Tables exist".

Never paste this address into a chat, an email thread with other people, or a screenshot.

### Step 12: Start the app

- [ ] Double-click **`Start App.cmd`**
- [ ] Your browser opens http://localhost:3000 and shows the home page
- [ ] Click **Create account**, type your email address and a password of at least 10 characters, and reach the dashboard. This account exists only in this app; there is no "forgot password" yet, so let your browser save it
- [ ] Open **Notes** and add a note. It appears in the list

Leave the window open while you work. Close it to stop the app.

### Step 13: Publish your first change

This proves the whole path works: your computer to GitHub.

- [ ] In VS Code, open `ONBOARDING.md` and tick a few boxes in it by changing `[ ]` to `[x]`. Save the file
- [ ] Double-click **`Publish.cmd`**. When it asks what changed, type `Finish onboarding` and press Enter
- [ ] It ends with "Published (saved to GitHub)"

Publish (save to GitHub) sends your work to GitHub. It does not change the live site. That is a separate step, Deploy (deploy to Vercel), which you do with `Deploy.cmd` when the work is ready for visitors. Both are explained in [HELP.md](HELP.md), section 8.

## You are set up

- [ ] Open the `IAN_APP` folder in Claude Code and say hello. It reads `CLAUDE.md` and knows how this project works

From now on, the routine for every session is in [HELP.md](HELP.md), section 2. The short version:

1. Double-click `Sync.cmd`
2. Double-click `Start App.cmd`
3. Work with your agent
4. Double-click `Publish.cmd`

## If something goes wrong

| What you see | What to do |
| --- | --- |
| Double-clicking a `.cmd` or `.command` file says Node is not installed | Step 5, then restart the computer |
| "git is not recognized" | Step 4, then restart the computer |
| On a Mac, a double-click file says you "do not have appropriate access privileges" | Open the Terminal and run `cd ~/Desktop/IAN_APP` and then `chmod +x *.command` |
| On a Mac, getting the project asks for a username and password | Press `Ctrl` + `C`, then do the `gh auth login` line in step 4 |
| "Repository not found" when getting the project | Accept the GitHub invitation from step 1 |
| The doctor shows a red line | Do what its arrow says. It names the step here |
| The browser shows nothing at http://localhost:3000 | Wait ten seconds and refresh. Check that the `Start App.cmd` window is still open |
| Anything else | [HELP.md](HELP.md), section 7, or ask Claude and paste the whole message you see |
