1. Overall Visual Concept
Design Theme: Mondrian / De Stijl
Bold black dividing lines
Primary colours (Red / Yellow / Blue) with white & black
Geometric blocks, strong grid composition
Device Frame: iPhone-style mock
Outer grey background (#e0e0e0), centred content
Inner device with thick black outline, large radius, heavy drop shadow
Screen area: white/grey background, vertical layout, overflow hidden
Aesthetic Quality:
Flat colours, no gradients
Crisp borders, poster-like typography
Visual impression similar to cut-paper collage
2. Colour System
2.1 Base Palette
const PALETTE = {
  red: 'bg-[#FF0000] text-white',
  yellow: 'bg-[#FFD700] text-black',
  blue: 'bg-[#0000FF] text-white',
  white: 'bg-white text-black',
  black: 'bg-black text-white',
  gray: 'bg-gray-100 text-black',
};
2.2 Colour Principles
Maximum contrast (primary colours + black borders)
Text always uses high-contrast white/black
Decorative blocks around images use strong primary colours
All colour fills are flat, never gradient or textured
3. Typography System
3.1 Font Families
Global: Sans-serif (font-sans)
Emphasis: large weight (bold → black)
3.2 Hierarchy
Main Page Title:
text-3xl to text-4xl, font-black, uppercase, tight tracking
Section Labels / Chips:
Black background, white text
text-xs font-bold uppercase px-2 py-1
Body Text:
Bold, uppercase, text-xl, tight leading
Subtext (Notes):
text-xs font-bold opacity-75 uppercase
3.3 Style Characteristics
Strong ALL CAPS usage
Poster-like spacing (tracking-tighter / tracking-widest)
Text is treated as geometric shapes rather than neutral body copy
4. Layout & Grid System
4.1 Core Structure
Vertical layout: flex flex-col h-full
Reserved top space for status bar & header
Content below follows Mondrian-style hard grid
Bottom navigation fixed at the bottom with thick border
4.2 Borders & Dividers
Fundamental aesthetic element: Thick black borders
Outer container: border-4 border-black
Inner dividers: border-2 border-black
Grid edges use border-r-4 / border-b-4
4.3 Header Block
Fixed height (h-14 or h-16)
Bottom border: border-b-4 border-black
Left: Page title
Right: A coloured block button (blue/yellow/red)
4.4 Content Regions
Explore View
Top: image container with decorative geometric blocks
Lower: a 4-column grid
col-span-3: channel label + text
col-span-1: vertical segmented actions using red/yellow blocks
Create View
Yellow header bar
Stacked form blocks with thick borders and heavy shadows
Large textarea block with focus:ring highlight
Library View
Title + count label row
grid grid-cols-2 gap-4
Mix of 2:1 wide cards and square cards, all bordered
4.5 Bottom Bars
Pagination Bar (Explore)
Thin bar segmented into equal rectangles
Active segment is black, others white
Bottom Navigation Bar
White background, black top border
3 equal compartments
Icon + label (uppercase, ultra-tight tracking)
5. Component Style Patterns
5.1 Buttons
Global button traits:
relative flex items-center justify-center
Thick black border
Flat colour fills
Heavy drop shadow:
shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
Pressed effect:
active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
Variants:
Primary: Yellow + black border
Secondary: White + black border
Accent: Red + black border
Black: Black background, reversed text
5.2 Image Cards (Explore)
object-cover full-bleed image
Heavy black border: border-4 border-black
Large shadow: shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
Overlaid Mondrian blocks (absolute positioned)
5.3 Library Cards
Container:
relative group border-4 border-black
Square or 2:1 aspect ratio
Image uses:
grayscale by default
Colour returns on hover (group-hover:grayscale-0)
Highlight on hover: translucent white border
Bottom strip label with primary/neutral colours
5.4 Tags / Pills
Black background, white uppercase text
Compact: inline-block px-2 py-1 text-xs font-bold uppercase
Used for category indicators & metadata chips
5.5 Text Input Blocks (Create)
Large textarea:
border-4 border-black p-4
Big shadow (same as cards)
Focus: focus:ring-4 focus:ring-blue-400
Submit block:
Full-width, thick black border, strong uppercase text
Press-down interaction with shadow reduction
6. Icons & Decorative Elements
6.1 Icons
Library: lucide-react (linear, geometric)
Standard stroke: 2
Active stroke: 3
Used minimally and integrated within blocky compositions
6.2 Navigation Icons
Size: ~26
Label: uppercase, tiny (text-[9px] font-black tracking-widest)
Active state: black background, white icon + text
7. Status Bar & Device Details
7.1 Top Status Bar
White background, black text
Contains:
Bold time (font-bold text-sm)
Signal blocks (three black rectangles of different height)
Battery indicator with inner black fill
7.2 Home Indicator
Black rounded bar at the bottom
Decorative only (pointer-events-none)
8. Interaction & Motion Style
(Only stylistic interaction feedback; no functional behaviour.)
Hover States
Slight colour shifts (stronger or darker primary colours)
Library images fade from grayscale → full colour
Active/Pressed States
Distinct paper-press effect via pixel offset
Shadow disappears or becomes weaker
Opacity
Subtle elements use opacity-75
Segment Highlighting
Navigation and pagination use clear black/white toggles
9. Style Tokens (Abstracted for Systems / Prompting)
Colour Tokens
primary.red = #FF0000
primary.yellow = #FFD700
primary.blue = #0000FF
neutral.white = #FFFFFF
neutral.black = #000000
neutral.gray = #F5F5F5 / gray-100
Border Tokens
border.thick = 4px solid black
border.medium = 2px solid black
Shadow Tokens
shadow.card = (8px, 8px, 0, 0, black)
shadow.button = (4px, 4px, 0, 0, black)
Typography Tokens
heading.main = uppercase, font-black, 3xl–4xl, tracking-tight
label.chip = uppercase, font-bold, text-xs, black/white
nav.label = uppercase, font-black, text-[9px], tracking-widest
Interaction Tokens
pressOffset = (x: 4px, y: 4px)
pressShadow = none
hoverColorShift = ± small brightness change
imageHover = grayscale → colour, 300ms transition