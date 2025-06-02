# 🎮 Pixel Invaders

A classic 2D space shooter game built **entirely with JavaScript and the HTML5 Canvas API** — no HTML or CSS used.  
Everything is dynamically rendered and managed using JavaScript only.

---

## 🚀 Features

- Pure JavaScript implementation (no HTML/CSS)
- Canvas-based rendering
- Custom start screen with clickable Start and Restart buttons
- Real-time collision detection and scoring
- Game over screen and restart functionality

---

## 🕹 Gameplay Logic

### 🛰 Starfighter Movement

1. Moves left and right using **arrow keys** (`keyCode: 37, 39`)
2. Pressing right increases `x`, left decreases `x`
3. Movement stops when the key is released
4. Starfighter is constrained to stay within the canvas
5. Game continuously re-renders to reflect movement

---

### 🔫 Bullet Creation

1. Press the **spacebar** (`keyCode: 32`) to fire bullets
2. Bullets move upward (`y--`)
3. Each bullet is tracked in a `bulletList` array
4. Position is based on the starfighter’s location at firing
5. All bullets are rendered every frame

---

### 👾 Enemy Creation

1. Enemies spawn at **random x positions**
2. Enemies fall downwards (`y++`)
3. A new enemy is created **every second**
4. If an enemy reaches the bottom of the canvas, the game ends
5. If a bullet hits an enemy, the enemy is removed and the score increases by 1

---

### 💥 Enemy Destruction Logic

1. Bullet hits enemy (bullet y <= enemy y)
2. Bullet x should be within enemy x range
3. On collision, remove both bullet and enemy, and add point 
   Condition: bullet.y <= enemy.y && bullet.x >= enemy.x && bullet.x <= enemy.x + enemy width