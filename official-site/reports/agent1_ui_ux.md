# BRUTAL UX OPTIMIZATION CRITIQUE - PIAZZA MARCONI CAFE
**Target:** official-site (Home, Menu, Catering, Lavora Con Noi)
**Auditor Persona:** Hostile & Hyper-Critical Customer

I have reviewed this absolute mess of a codebase. Frankly, it's a miracle anyone manages to use this site without throwing their device against a wall. The layout shifts, the typographic hierarchy is a joke, and the forms are completely riddled with friction. Here are 10 distinct, embarrassing UI/UX defects that need to be fixed immediately.

### 1. The Global Navigation Ghost Town (`layout.tsx`)
There is NO Header or Navbar! Users are trapped on whichever page they land on. How are they supposed to navigate between Home, Menu, Catering, and Lavora Con Noi seamlessly? Telepathy? It's an unforgivable omission that breaks basic web standards.

### 2. The "Back" Button Chaos (`catering/page.tsx` vs `lavora-con-noi/page.tsx`)
The `catering` page uses a hardcoded, floating button at `fixed top-4 left-4 z-[999]`, while `lavora-con-noi` uses `absolute top-6 left-6 z-20`. Not only do they clash with mobile safe areas (like the iPhone notch or status bars), but the inconsistency makes the site feel cobbled together by two different people who didn't communicate.

### 3. Broken Phone Validation Regex (`CateringChatbox.tsx`)
The regex `/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im` is an absolute joke. It forces a 3-digit international prefix block. Guess what? Italy's prefix is `+39` (two digits!). Any Italian user trying to enter their phone number properly with a prefix will get an error and be permanently locked out of submitting the form. Unbelievable.

### 4. Zero Error Recovery in the Chatbox (`CateringChatbox.tsx`)
If a user makes a single typo in the Chatbox, there is no way to go back one step. The ONLY option is the "Riavvia" button, which completely nukes their progress and forces them to start from scratch. High friction? More like a brick wall.

### 5. Time-Traveling Catering Reservations (`CateringChatbox.tsx`)
The input type changes to `date` and `number`, but there are NO constraints. I can literally book a catering event for the year 1990 with -5 guests. Add a `min` attribute to your HTML5 inputs before you embarrass yourselves further!

### 6. Destructive External Redirections (`Hero.tsx` & `CateringChatbox.tsx`)
The Chatbox form submission uses `window.location.href` to redirect to WhatsApp, violently kicking users out of the website. The same goes for the Menu link in the Hero component which lacks `target="_blank"`. You are literally driving your own traffic away and destroying session retention.

### 7. The Pathetic "CV Upload" Hack (`CollaborazioniForm.tsx`)
Instead of providing a simple file upload (`<input type="file" />`), you tell candidates to manually attach their CV *after* they are redirected to WhatsApp. Who designed this? Users will either forget, get confused, or just give up. Expect a massive drop-off rate on job applications.

### 8. Ghost Data on Form Reset (`CollaborazioniForm.tsx`)
Clicking "Cambia Categoria" resets the role state but leaves the `data` object completely intact. If I type my name as a "Candidato" and switch to "Fornitore", my old inputs are still sitting there in the background. It feels cheap and buggy.

### 9. Accessibility Nightmare: Autoplay Video (`Hero.tsx`)
The hero background video uses `dangerouslySetInnerHTML` with `autoplay` and `scale-105`. There is no pause button and absolutely no check for `prefers-reduced-motion`. This is a blatant violation of WCAG guidelines for users with vestibular disorders. Do you enjoy giving people motion sickness?

### 10. Typographic Whiplash & Asymmetry (`CateringReservation.tsx`)
The text sizes jump erratically from massive `text-6xl` headings to tiny `text-xs` buttons, completely destroying visual rhythm. Furthermore, the floating "100% Artigianale" badge (`-bottom-8 -left-8`) overlaps the image awkwardly and creates spacing asymmetries that break the layout grid on smaller viewports.
