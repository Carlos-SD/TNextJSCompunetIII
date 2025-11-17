# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - img "Footballers Bets Logo" [ref=e7]
    - heading "Bienvenido a Apostólicos!" [level=1] [ref=e8]
    - paragraph
    - generic [ref=e9]:
      - textbox "Ingresa tu nombre de usuario" [ref=e11]: admin
      - textbox "Ingresa tu contraseña" [ref=e13]: password123
      - generic [ref=e14]:
        - generic [ref=e15] [cursor=pointer]:
          - checkbox "Recordarme" [ref=e16]
          - generic [ref=e17]: Recordarme
        - link "¿Olvidaste tu contraseña?" [ref=e18] [cursor=pointer]:
          - /url: "#"
      - button "Iniciar Sesión" [ref=e19]
    - paragraph [ref=e20]:
      - text: ¿No tienes una cuenta?
      - link "Regístrate" [ref=e21] [cursor=pointer]:
        - /url: /register
  - button "Open Next.js Dev Tools" [ref=e30] [cursor=pointer]:
    - generic [ref=e33]:
      - text: Compiling
      - generic [ref=e34]:
        - generic [ref=e35]: .
        - generic [ref=e36]: .
        - generic [ref=e37]: .
  - alert [ref=e38]
```