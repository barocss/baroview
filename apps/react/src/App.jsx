export default function App() {
  return (
    <div className="app">
      <h1>baroview (React)</h1>
      <p className="intro">All examples from the HTML app. Single, grid, gallery, and every slide variant.</p>

      <section>
        <h2>Single URL</h2>
        <baro-view url="/demo.svg" />
      </section>

      <section>
        <h2>Grid (2 columns)</h2>
        <baro-view urls="/demo.svg /demo.md" layout="grid" columns="2" />
      </section>

      <section>
        <h2>Image + Markdown + PDF</h2>
        <baro-view url="/demo.svg" />
        <baro-view url="/demo.md" />
        <baro-view url="/demo.pdf" />
      </section>

      <section>
        <h2>3-column grid</h2>
        <baro-view urls="/demo.svg /demo.md /demo.pdf" layout="grid" columns="3" />
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
        />
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
        />
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
        />
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
        />
      </section>

      <section>
        <h2>Slides (transition: fade)</h2>
        <baro-view
          urls="/demo.svg /demo.md /demo.pdf"
          layout="gallery"
          gallery-style="slides"
          slides-transition="fade"
          slides-height="320"
        />
      </section>

      <section>
        <h2>Slides (transition: slide)</h2>
        <baro-view
          urls="/demo.svg /demo.md /demo.pdf"
          layout="gallery"
          gallery-style="slides"
          slides-transition="slide"
          slides-height="320"
        />
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
        />
      </section>

      <section>
        <h2>Slides (inline pre/code)</h2>
        <baro-view layout="gallery" gallery-style="slides" slides-height="380" slides-pagination="fraction">
          <baro-view-item>
            <pre>{'Plain text slide.\nNo URL – inline content.'}</pre>
          </baro-view-item>
          <baro-view-item>
            <code><pre>{'const x = 1;\nconsole.log(x);'}</pre></code>
          </baro-view-item>
          <baro-view-item url="/demo.svg" />
        </baro-view>
      </section>

      <section>
        <h2>Slides test (12 items, dots, horizontal)</h2>
        <baro-view
          urls="/demo.svg /demo.md /demo.pdf /demo.svg /demo.svg /demo.md /demo.pdf /demo.svg /demo.svg /demo.md /demo.pdf /demo.svg"
          layout="gallery"
          gallery-style="slides"
          slides-height="480"
          slides-toolbar-style="frosted"
          slides-arrows="edges"
          slides-fullscreen
        />
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
        />
      </section>
    </div>
  );
}
