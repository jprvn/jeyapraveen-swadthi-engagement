# Jeya Praveen & Swadthi — Interactive Engagement Invitation

A mobile-first interactive invitation designed for GitHub Pages.

## Deploy in under 5 minutes

1. Create a new GitHub repository.
2. Upload every file and folder from this package to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/(root)**
5. Save. GitHub will display your public invitation URL.

## Edit the invitation

Open `config.js`. All editable event content is grouped there:
- Couple names
- Date and time
- Venue and address
- Google Maps link
- Share message
- Future photo/gallery/live-stream URLs

Replace `assets/hero-invitation.png` to change the invitation artwork while keeping the same website.

## Add guest photo uploads later

The fastest options are:
- Google Form with file upload
- Microsoft Form with file upload
- Firebase Storage
- Cloudinary upload widget

Paste the final upload link into:

```js
future: {
  photoUploadUrl: "YOUR_LINK_HERE"
}
```

## Recommended future upgrades

- Event timeline for engagement, reception and wedding
- Guest photo wall
- Live-stream button
- RSVP form
- Parking and travel instructions
- Accommodation information
- Thank-you page after the event
- Photo gallery and downloadable album

## Important

The invitation uses a Google Fonts connection. The site still works if fonts fail, but will use fallback fonts.
