<main class="app">
  <h1>baroview (Svelte)</h1>
  <p class="intro">All examples from the HTML app. Single, grid, gallery, and every slide variant.</p>

  <section>
    <h2>Single URL</h2>
    <baro-view url="/demo.svg"></baro-view>
  </section>

  <section>
    <h2>Grid (2 columns)</h2>
    <baro-view urls="/demo.svg /demo.md" layout="grid" columns="2"></baro-view>
  </section>

  <section>
    <h2>Image + Markdown + PDF</h2>
    <baro-view url="/demo.svg"></baro-view>
    <baro-view url="/demo.md"></baro-view>
    <baro-view url="/demo.pdf"></baro-view>
  </section>

  <section>
    <h2>3-column grid</h2>
    <baro-view urls="/demo.svg /demo.md /demo.pdf" layout="grid" columns="3"></baro-view>
  </section>

  <section>
    <h2>Slides (fraction)</h2>
    <baro-view
      urls="/demo.svg /demo.md /demo.pdf /demo.svg"
      layout="gallery"
      gallery-style="slides"
      slides-pagination="fraction"
      slides-height="380"
      slides-fullscreen
    ></baro-view>
  </section>

  <section>
    <h2>Slides (progress bar)</h2>
    <baro-view
      urls="/demo.svg /demo.md /demo.pdf /demo.svg"
      layout="gallery"
      gallery-style="slides"
      slides-pagination="progress"
      slides-height="380"
      slides-fullscreen
    ></baro-view>
  </section>

  <section>
    <h2>Slides (deep link #slide=N)</h2>
    <baro-view
      urls="/demo.svg /demo.md /demo.pdf /demo.svg"
      layout="gallery"
      gallery-style="slides"
      slides-deep-link
      slides-height="380"
      slides-fullscreen
    ></baro-view>
  </section>

  <section>
    <h2>Slides (loop)</h2>
    <baro-view
      urls="/demo.svg /demo.md /demo.pdf"
      layout="gallery"
      gallery-style="slides"
      slides-loop
      slides-height="380"
      slides-fullscreen
    ></baro-view>
  </section>

  <section>
    <h2>Slides (transition: fade)</h2>
    <baro-view
      urls="/demo.svg /demo.md /demo.pdf"
      layout="gallery"
      gallery-style="slides"
      slides-transition="fade"
      slides-height="320"
    ></baro-view>
  </section>

  <section>
    <h2>Slides (transition: slide)</h2>
    <baro-view
      urls="/demo.svg /demo.md /demo.pdf"
      layout="gallery"
      gallery-style="slides"
      slides-transition="slide"
      slides-height="320"
    ></baro-view>
  </section>

  <section>
    <h2>Slides from Markdown (H1 split)</h2>
    <baro-view
      layout="gallery"
      gallery-style="slides"
      slides-from-markdown="/demo.md"
      slides-height="380"
      slides-pagination="fraction"
      slides-fullscreen
    ></baro-view>
  </section>

  <section>
    <h2>Slides (inline pre/code)</h2>
    <baro-view layout="gallery" gallery-style="slides" slides-height="380" slides-pagination="fraction">
      <baro-view-item>
        <pre>Plain text slide.
No URL – inline content.</pre>
      </baro-view-item>
      <baro-view-item>
        <code><pre>const x = 1;
console.log(x);</pre></code>
      </baro-view-item>
      <baro-view-item url="/demo.svg"></baro-view-item>
    </baro-view>
  </section>

  <section>
    <h2>Slides test (12 items, horizontal)</h2>
    <baro-view
      urls="/demo.svg /demo.md /demo.pdf /demo.svg /demo.svg /demo.md /demo.pdf /demo.svg /demo.svg /demo.md /demo.pdf /demo.svg"
      layout="gallery"
      gallery-style="slides"
      slides-height="480"
      slides-toolbar-style="frosted"
      slides-arrows="edges"
      slides-fullscreen
    ></baro-view>
  </section>

  <section>
    <h2>Slides test (12 items, vertical)</h2>
    <baro-view
      urls="/demo.svg /demo.md /demo.pdf /demo.svg /demo.svg /demo.md /demo.pdf /demo.svg /demo.svg /demo.md /demo.pdf /demo.svg"
      layout="gallery"
      gallery-style="slides"
      slides-direction="vertical"
      slides-height="480"
      slides-toolbar-style="frosted"
      slides-arrows="edges"
      slides-fullscreen
    ></baro-view>
  </section>
</main>

<style>
  .app { max-width: 800px; margin: 0 auto; }
  .intro { color: #555; margin-bottom: 1.5rem; }
  section { margin-bottom: 2rem; }
  h2 { font-size: 1rem; margin-bottom: 0.5rem; }
  :global(baro-view) { display: block; margin: 0.5rem 0; border: 1px solid #ddd; border-radius: 8px; min-height: 200px; }
</style>
