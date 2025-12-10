# Design Guide - Using the Rich Ethereal Modernism System

## 🎨 Quick Start

The design system is fully implemented and ready to use. All components automatically use the new aesthetic.

## 📱 Viewing the App

### Desktop Preview
When you run `npm run dev`, the app will display inside an iPhone frame:
- Realistic device mockup
- Centered on screen with glow effects
- Perfect for presentations and demos

### Mobile/Responsive
The same design scales beautifully on actual mobile devices:
- Remove the frame for native feel
- All interactions optimized for touch
- Gesture-friendly spacing

## 🎯 Creating New Components

### Using Glass Effects

```tsx
// Light glass (subtle)
<div className="glass">
  Content
</div>

// Strong glass (prominent)
<div className="glass-strong">
  Content
</div>
```

### Organic Shapes

```tsx
// Three preset organic shapes
<div className="organic-shape-1">...</div>
<div className="organic-shape-2">...</div>
<div className="organic-shape-3">...</div>

// Or use custom combinations
<div className="rounded-[2rem_0.5rem_2rem_0.5rem]">...</div>
```

### Gradient Text

```tsx
<h1 className="gradient-text font-display text-5xl italic">
  Beautiful Heading
</h1>
```

### Neon Borders

```tsx
// Cyan glow
<div className="neon-border-cyan">...</div>

// Violet glow
<div className="neon-border-violet">...</div>
```

## 🎬 Adding Animations

### Hover Effects

```tsx
// Scale up on hover
<div className="hover-scale">...</div>

// Liquid button (scale down on click)
<button className="liquid-button">...</button>
```

### Entrance Animations

```tsx
// Slide in from bottom with scale
<div className="card-enter">...</div>
```

### Background Animations

```tsx
// Gradient shift (already applied to body)
<div className="animate-gradient-shift bg-gradient-to-br from-midnight-900 via-midnight-700 to-midnight-800">
  ...
</div>

// Float effect
<div className="animate-float">...</div>

// Glow pulse
<div className="animate-glow-pulse">...</div>
```

## 🎨 Color Usage

### Text Colors

```tsx
// Primary text
<p className="text-white/90">Main content</p>

// Secondary text
<p className="text-white/60">Supporting info</p>

// Tertiary text
<p className="text-white/40">Subtle details</p>

// Labels (uppercase, tracked)
<span className="text-ethereal-cyan/70 uppercase tracking-wide text-xs">
  Label
</span>
```

### Background Colors

```tsx
// Card backgrounds
<div className="glass-strong">...</div>

// Overlays
<div className="bg-midnight-900/80 backdrop-blur-md">...</div>

// Gradients
<div className="bg-gradient-to-br from-ethereal-cyan via-ethereal-violet to-ethereal-indigo">
  ...
</div>
```

## 🔘 Button Patterns

### Primary Button (Gradient)

```tsx
<Button variant="primary" size="md">
  Primary Action
</Button>
```

### Secondary Button (Glass)

```tsx
<Button variant="secondary" size="md">
  Secondary Action
</Button>
```

### Outline Button (Neon)

```tsx
<Button variant="outline" size="md">
  Tertiary Action
</Button>
```

## 📋 Card Patterns

### Basic Card

```tsx
<div className="glass-strong organic-shape-1 p-6 shadow-colored-dark hover-scale">
  <h3 className="text-xl font-display font-semibold text-white mb-2">
    Card Title
  </h3>
  <p className="text-white/70 font-light">
    Card content goes here
  </p>
</div>
```

### Card with Neon Border

```tsx
<div className="glass-strong organic-shape-2 p-6 neon-border-cyan hover-scale">
  Content
</div>
```

## 📝 Form Elements

### Input Field

```tsx
<Input
  label="Field Label"
  placeholder="Enter text..."
  className="focus-glow"
/>
```

### Focus States
All inputs automatically get neon cyan glow on focus. No additional classes needed.

## 🌊 Spacing System

Use these spacing values for consistency:

```tsx
// Small gaps
gap-2    // 8px
gap-3    // 12px
gap-4    // 16px

// Medium spacing  
p-4      // 16px padding
p-6      // 24px padding
mb-6     // 24px bottom margin

// Large spacing
p-8      // 32px padding
mb-10    // 40px bottom margin
```

## 🎭 Typography Scale

```tsx
// Massive display (hero)
<h1 className="text-6xl font-display italic gradient-text">
  Hero Title
</h1>

// Large display (page titles)
<h1 className="text-5xl font-display font-bold gradient-text">
  Page Title
</h1>

// Section headings
<h2 className="text-2xl font-display font-semibold text-white">
  Section
</h2>

// Card headings
<h3 className="text-xl font-display font-semibold text-white">
  Card Title
</h3>

// Body text
<p className="text-base text-white/90 font-light leading-relaxed">
  Content
</p>

// Small labels
<span className="text-xs text-ethereal-cyan/70 uppercase tracking-wide">
  Label
</span>
```

## 🎯 Layout Patterns

### Page Layout

```tsx
<Layout showNav={true}>
  <div className="p-6">
    <div className="mb-10">
      <h1 className="text-5xl font-display font-bold gradient-text mb-3 italic">
        Page Title
      </h1>
      <p className="text-white/60 font-light tracking-wide">
        Subtitle or description
      </p>
    </div>
    
    {/* Content */}
  </div>
</Layout>
```

### Modal Pattern

```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Modal Title"
  footer={
    <div className="flex gap-2">
      <Button variant="outline" onClick={handleClose}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleConfirm}>
        Confirm
      </Button>
    </div>
  }
>
  <p className="text-white/80">Modal content</p>
</Modal>
```

## 🎨 Custom Shadows

```tsx
// Neon cyan glow
className="shadow-neon-cyan"

// Neon violet glow
className="shadow-neon-violet"

// Colored shadow (violet tint)
className="shadow-colored-dark"

// Glass shadow
className="shadow-glass"
```

## ⚠️ Best Practices

### DO ✅
- Use glassmorphism for overlays and cards
- Apply organic shapes to maintain flow
- Use gradient text for headlines
- Add hover-scale to interactive elements
- Maintain extreme whitespace
- Use neon colors sparingly for accents

### DON'T ❌
- Use black shadows (use colored shadows instead)
- Use solid backgrounds (prefer glass/gradients)
- Use regular border-radius (use organic shapes)
- Overcrowd the layout (embrace whitespace)
- Use too many neon elements (keep it balanced)

## 🎬 Animation Guidelines

- Hover: 0.3s ease-out
- Click: 0.2s cubic-bezier (liquid feel)
- Entrance: 0.5s cubic-bezier
- Background: 15s+ for ambient animations

## 📐 Z-Index Layers

```
1  - Noise overlay
2  - Main content
10 - Cards and components
40 - Status bar
50 - Navigation
50 - Modals
```

## 🚀 Performance Tips

- backdrop-filter is hardware-accelerated
- transform animations are GPU-optimized
- Use will-change sparingly
- Images use lazy loading
- Gradients animate via background-position

---

**Happy Designing! ✨**

The system is designed to be intuitive - most components will automatically look great with minimal additional styling.

