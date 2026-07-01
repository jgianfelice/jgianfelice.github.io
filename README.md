# Justin Gianfelice — Personal Site

A dark, editorial personal website with a live 3D market-surface hero,
reading content live from your Notion workspace.

---

## STEP-BY-STEP: Run it on your machine

You have Node installed, so this is quick.

### 1. Unzip the folder
Unzip `jgianfelice-site.zip` somewhere easy to find, like your Desktop.

### 2. Open Terminal IN that folder
- Open Terminal
- Type `cd ` (with a space after cd)
- Drag the unzipped `jgianfelice-site` folder onto the Terminal window — it pastes the path
- Press Enter

You should now be "inside" the folder.

### 3. Install (only needed once)
Paste this and press Enter:
```
npm install
```
Wait for it to finish (a minute or two).

### 4. Add your Notion token
- Find the file called `.env.local.example` in the folder
- Make a copy of it and rename the copy to exactly `.env.local`
- Open it in any text editor
- Replace `ntn_your_token_here` with your actual Notion token (the `ntn_...` one)
- Save

> The site works without this — you'll just see placeholder content until
> the Notion connection is wired in the next build pass.

### 5. Start it
Paste this and press Enter:
```
npm run dev
```

When it says `Ready`, open your browser to:
```
http://localhost:3000
```

That's it. You'll see the site.

---

## What to do next

Take screenshots of what you see — the hero, the scroll, anything that
looks off — and send them back. That's how we refine it to the final bar.

To stop the server: click the Terminal and press `Ctrl + C`.
To start it again later: just `npm run dev` from the folder.
