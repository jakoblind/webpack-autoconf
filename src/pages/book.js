import React from 'react'
import styles from '../styles.module.css'
import { Link } from 'gatsby'
import { SampleChapterSignupForm, withHidden } from '../SignupForms'
import Layout from '../components/layout'

export const HiddenSampleChapterSignupForm = withHidden(
  SampleChapterSignupForm,
  'Get a sample chapter'
)

const BuyButton = () => (
  <a
    href="https://transactions.sendowl.com/products/77947612/04BA2522/purchase"
    rel="nofollow"
    className={styles.myButton}
  >
    Buy Now for $24
  </a>
)

export default () => {
  return (
    <Layout title="Learn webpack">
      <div className={styles.webpackConfigContainer}>
        <h1 className={styles.large}>Learn webpack</h1>
        <h2 className={styles.subtitle}>A handbook for webpack beginners</h2>
        <div className={styles.center}>
          <BuyButton />
          <p>
            <HiddenSampleChapterSignupForm />
          </p>
        </div>
        <h3>You cant learn webpack from shiny tools</h3>
        <p>
          If you ask on reddit or discord how to approach the frontend ecosystem
          they will tell you to learn one thing at once.
        </p>
        <p>
          A common recommendation is to start with JavaScript, and then move on
          to React when you are ready. You should use create-react-app (CRA) to
          create your project. You can learn webpack “later”.
        </p>
        <p>
          The problem with this strategy is that later never comes. And suddenly
          you have grown out of CRA and need to extend it. So you eject your app
          and get this thrown in your face:
        </p>
        <img
          src={require('../../images/webpackmedium.webm.gif')}
          width="100%"
        />
        <p>
          You get not only one – but three webpack config files. At a total of
          989 lines of code. And that’s just the webpack configs. There are more
          config files and build scripts that got generated for you. That is
          overwhelming.
        </p>
        <p>
          The webpack config file is well commented, but it doesn’t help when
          you have no idea how webpack works.
        </p>
        <p>You can’t learn webpack by reading a huge config file.</p>
        <p />
        <h3>A strategy for learning webpack that works</h3>
        <p>You already know how to learn a new language or tool:</p>
        <ol className={styles.bookFeatures}>
          <li>You start by reading about the most basic features.</li>
          <li>
            Then you write some code yourself implementing these basic features
            in a small project.
          </li>
          <li>It works! Your confidence grows.</li>
          <li>
            Now you are ready for some more advanced concepts. You read about it
            and repeat the process.
          </li>
        </ol>
        <p>
          An essential aspect of learning programming is to write code yourself.
          Only reading is not enough.
        </p>
        <p>
          You know how this works because you have already learned JavaScript,
          React and probably lots of other languages and tools.
        </p>
        <p>
          The feeling of knowing how everything works – including the build
          setup – in your app is awesome.
        </p>
        <p>
          With such depth in your skills and knowledge, you are a frontend dev
          that knows how to set up any kind webpack project. You are able to go
          in and upgrade, tweak and optimize existing webpack projects.{' '}
        </p>
        <h3>New book: Learn webpack</h3>
        <p>
          In this book you'll start with a clean slate - just you and an empty
          text editor. You will learn step-by-step how to build the{' '}
          <code>webpack.config.js</code>, <code>package.json</code>,{' '}
          <code>.babelrc</code> and all other files required to build a modern
          web apps with webpack.
        </p>
        <p>
          This is a <i>complete</i> and <i>up-to-date</i> resource for webpack
          beginners.
        </p>
        <h3>What does the book cover?</h3>
        <p>
          This book is a handbook for creating enterprise-ready production apps
          with webpack. These are the main topics covered:
        </p>
        <ul>
          <li>Why do you need webpack?</li>
          <li>Getting started tutorial</li>
          <li>
            What happens under-the-hood? A deep dive into loaders, plugins,
            manifests, etc.
          </li>
          <li>An introduction to NPM and package.json</li>
          <li>How to configure separate prod and test configs</li>
          <li>More than one output for SSR and public/admin sites</li>
          <li>Create an awesome dev experience</li>
          <li>Optimized production builds to get a small bundle size</li>
          <li>Code splitting to make faster apps</li>
          <li>Caching for quicker load speeds</li>
          <li>What is tree shaking and how to use it to create fast apps</li>
          <li>How to enable source maps for better debugging experience</li>
          <li>A bunch of recipes for React, Vue, Typescript, etc</li>
        </ul>
        <div>
          <a href="https://s3-eu-west-1.amazonaws.com/jakoblind/Learn+webpack+TOC.pdf">
            Read the full table of contents here
          </a>
        </div>
        <p>The book is made up of three parts:</p>
        <p>
          <b>Part 1: The Getting started tutorial </b>
          You'll jump straight into coding your first React app with webpack.
          You start from scratch and you will finish up with a complete webpack
          project that you can put in production. This tutorial is designed to
          get you up and running quickly.
        </p>
        <p>
          <b>Part 2: Production-ready apps with webpack </b>
          You’ll learn how to configure an awesome developer experience that
          makes you super productive <i>and</i> use tools and techniques to get
          the lowest possible bundle size for the production build. You’ll also
          learn about the internals of webpacks. Loaders, plugins, manifests and
          chunks will no longer feel like magic
        </p>
        <p>
          <b> Part 3: Recipes</b> Even the webpack pros have to look up how to
          configure specific things like Vue, React, Typescript, etc. In this
          part of the book, you will have recipes that you can use to create the
          app you want to create - so you don't have read long and outdated
          medium-articles to get the code you need.
        </p>
        <div>
          <HiddenSampleChapterSignupForm />
        </div>
        <div style={{ clear: 'both' }} />
        <p>
          <i>Zero fluff guaranteed</i>
        </p>
        <p>
          This is a short book - only 100 pages. It's to the point. And it has
          absolutely zero fluff - just actionable advice.{' '}
        </p>
        <h3>Buy Learn webpack</h3>
        <p>
          As a developer, the best investment you can make is to invest in your
          skills. When you know webpack you will be a more complete frontend
          dev. It will set you up for getting promotions.
        </p>
        <p>
          And if you're looking for a job, talking fluently in interviews about
          how to use code splitting and tree shaking with webpack will make you
          stand out from other frontend devs.
        </p>
        <h3>Book details</h3>
        <table className={styles.productTable}>
          <tr>
            <td>
              <b>Length:</b>
            </td>
            <td>100 pages</td>
          </tr>
          <tr>
            <td>
              <b>Format:</b>
            </td>
            <td>PDF and EPUB</td>
          </tr>
          <tr>
            <td>
              <b>Webpack version:</b>
            </td>
            <td>4</td>
          </tr>
        </table>
        <p />
        <BuyButton />
        <p>It's time for you to take back control of your webpack config!</p>
        <div style={{ clear: 'both' }} />
        <h3>Still not convinced?</h3>
        <p>
          <HiddenSampleChapterSignupForm />
          <br /> It can also be good to know that I offer a 30-day money back
          guarantee if you are not happy with the book.
        </p>
        <h3>About the author</h3>
        <img
          className={styles.authorImage}
          src="http://blog.jakoblind.no/wp-content/uploads/2017/07/jakobprofil-liten.jpg"
        />
        Hi, I'm Jakob Lind (
        <a href="https://twitter.com/karljakoblind">@karljakoblind</a>
        ). I'm a full stack developer and independent consultant. I have 10
        years of experience as a professional dev and I have been coding as a
        hobby since I was a kid.
        <br />
        <br />
        I’m a strong believer in sharing and helping others. I have a blog and I
        work on open source projects.
        <br />
        <br />
        The best way to learn how to program is to do hard and deep work. There
        are no shortcuts.
        <br />
        <br />
        <div style={{ clear: 'both' }} />
        <h3>FAQ</h3>
        <p>
          <b>Q: What if I don't like the book?</b>
        </p>
        <p>A: I offer a 30-day no-questions-asked money-back-guarantee</p>
        <p>
          <b>Q: What version of webpack do the book use?</b>
        </p>
        <p>A: It's written for the latest version of webpack: webpack 4. </p>
        <p>
          <b>
            Q: But soon there will be a new version of webpack and this book
            will be outdated?
          </b>
        </p>
        <p>
          A: Included in the price is a lifetime of updates! Whenever I update
          the book because there is a new version of webpack or if i extend the
          book with new material, you will get the update straight in your inbox
          with no additional cost.{' '}
        </p>
        <p>
          <b>Q: What formats do I get?</b>
        </p>
        <p>
          A: You'll get PDF and EPUB. If I some time in the future offer more
          formats, you will get them also of course.
        </p>
        <p>
          <b>Q: How many pages is it? </b>
        </p>
        <p>
          A: 100 pages. It's short and sweet so that you'll actually{' '}
          <b>read it</b>.
        </p>
      </div>
    </Layout>
  )
}
