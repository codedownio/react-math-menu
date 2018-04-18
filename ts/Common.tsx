
declare var MathJax;

export function getActiveJax() {
  try {
    let script = document.querySelectorAll(".main-math script")[0];
    let jax = MathJax.Hub.getJaxFor(script);
    return jax && jax.root;
  } catch (e) {
    return null;
  }
}
