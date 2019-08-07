import React from 'react'
import styles from '../styles.module.css'
import { SampleChapterSignupForm, withHidden } from '../components/SignupForms'
import Layout from '../components/layout'
//import Countdown from 'react-countdown-now'

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

/*const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return <span>Time's out</span>
  } else {
    return (
      <span>
        {days} days, {hours} hours and {minutes} minutes
      </span>
    )
  }
}
const Discount = () => (
  <div className={styles.discountBox}>
    Spring sale! Use the discount code <span>spring</span> in the checkout to
    get 25% off. <br />
    Discount expires in{' '}
    <Countdown date={new Date('2019-04-12T00:00:00')} renderer={renderer} />
  </div>
)*/

export default () => {
  return (
    <Layout title="Learn webpack">
      <div className={styles.webpackConfigContainer}>
        <h1 className={styles.large}>Learn webpack</h1>
        <h2 className={styles.subtitle}>A handbook for webpack beginners</h2>
        <div className={styles.center}>
          <a href="#buy" className={styles.myButton}>
            Buy Now
          </a>
          <p>
            <HiddenSampleChapterSignupForm />
          </p>
        </div>
        <h3>Configuring webpack is painful</h3>
        <p style={{ marginBottom: 0 }}>
          The heart of webpack — the <code>webpack.config.js</code> — has a
          syntax that probably makes sense for hackers on the internals of
          webpack. But for devs just wanting to create a new project, it's a
          nightmare to write.
        </p>
        <img
          alt="webpack config wtf"
          src={require('../../images/webpack-config.png')}
          width="100%"
          style={{ textAlgin: 'center' }}
        />
        <p style={{ marginTop: 0 }}>
          You see keywords like <code>module</code>, <code>rules</code>,{' '}
          <code>use</code>, <code>entry</code>, <code>plugins</code>. But what
          does that all even mean in the context of a build setup for a web app?
        </p>
        <p>
          You stumble around with webpack, browsing the docs, tutorials, blogs
          and YouTube to trying to make sense of it all. And you're really
          struggling.
        </p>
        <p>
          <i>
            The problem is that every tutorial has their creative way of
            configuring webpack.
          </i>
        </p>
        <p>
          One tutorial tells you to use the <code>html-webpack-plugin</code>{' '}
          (whatever that is?) and another tutorial doesn't mention that at all.
        </p>
        <p>
          One tutorial uses babel-preset-env and another uses something else.
        </p>
        <p>
          There just doesn't seem to be one standard way of implementing
          anything with webpack. This makes it very difficult to know what is
          the best practice way to configure it.
        </p>
        <h3>Javascript fatigue before hello world</h3>
        <p>
          To create a simple hello world app with webpack, you have to install
          LOTs of dependencies. First, there's <code>webpack</code>, which is
          fine. You already expected to install that. But then you
          <i>also</i> have to install all of the following as well:
        </p>
        <ul>
          <li>
            <code>webpack-cli</code>
          </li>
          <li>
            <code>webpack-dev-server</code>
          </li>
          <li>
            <code>babel-loader</code>
          </li>
          <li>
            <code>@babel/preset-react</code>
          </li>
          <li>
            <code>@babel/core</code>
          </li>
          <li>
            <code>@babel/preset-env</code>
          </li>
        </ul>
        <img
          alt="webpack config wtf"
          src={require('../../images/dependency-hell-overlay.png')}
          width="100%"
          style={{ textAlgin: 'center' }}
        />
        <p>
          These dependencies are only used for building the app — you haven’t
          even coded a single feature yet.
        </p>
        <p>
          You very quickly lose control over whats going on. You desperately
          start googling “babel”, “babel-preset-env” to learn what it’s doing
          but you just get overwhelmed with all the information.{' '}
        </p>
        <p>
          And you’re worried that all these dependencies will bloat your bundle.
          But it’s difficult to know because you don’t know what’s going on
          under-the-hood in webpack. Maybe webpack is smart and doesn’t put
          these in the output bundle? You are not sure.
        </p>
        <p>
          You want to be an awesome frontend dev knowing modern tools - but is
          it really supposed to be this hard just to get started coding a simple
          webpack app in 2019?
        </p>
        <h3>
          What if you had one source of truth for learning how to build fast,
          well-organized and scalable webpack apps?
        </h3>
        <p>
          What if you could use webpack to make fast apps by using the latest
          and greatest tech - without shipping too much to the end-user. Your
          apps would get quicker load speed and better overall performance. You
          would use powerful techniques like minifying and uglifying like a pro.
        </p>
        <img
          alt="100 web app speed"
          src={require('../../images/100-on-speed.png')}
          width="100%"
          style={{ textAlgin: 'center' }}
        />
        <p>
          Your app would be well-organized. The code would be easier to maintain
          even for big and complex code bases. And your build setup would be
          highly customizable and ready for the enterprise. You would never
          paint yourself into a corner.
        </p>
        <p>
          You would take full benefit of ES6 in your codebase. It would be a
          true future-focused app using the latest tech to make you as
          productive and up-to-date as possible. You could create apps with Vue,
          React, or whatever you want. The possibilities are endless.
        </p>
        <p>
          But most importantly you would understand frontend development much
          deeper. You would grow your skills and become a better dev. You would
          be a well-rounded developer in a really good position to get the job
          you want.
        </p>
        <h3>Learn webpack is a complete handbook for webpack beginners</h3>
        <p>
          Learn webpack is an e-book designed to make the process of learning
          webpack as quick and smooth as possible for you.
        </p>
        <p>
          To <i>deeply</i> learn webpack, you’ll start with a clean slate. No
          more copy-pasting boilerplates and ejecting CRA to try to figure out
          things backward. You’ll start with an empty editor and you'll write
          the whole <code>webpack.config.js</code> yourself.
        </p>
        <p>
          You will learn step-by-step how to build the{' '}
          <code>webpack.config.js</code>, <code>package.json</code>,{' '}
          <code>.babelrc</code> and all other files required to build a modern
          web app with webpack. This approach makes webpack super easy to learn.
        </p>
        <p>
          But it’s not enough just to learn the syntax. You’ll learn all about
          the dependencies like Babel, webpack-dev-server, and React hot loader.
          You learn what they do and why you need them. This way you can use the
          dependencies to your advantage, to make your app fast and beautiful
          for your users.
        </p>
        <p>
          You’ll also learn how to squeeze out every juice of webpack to make
          your app as fast as possible by using advanced techniques such as code
          splitting and tree shaking.
        </p>
        <p>
          This is a <i>complete</i> and <i>up-to-date</i> book for webpack
          beginners. It covers the latest stable version of webpack which is
          version 4.
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
          learn about the internals of webpack. Loaders, plugins, manifests and
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
        <h3 id="buy">Buy Learn webpack</h3>
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
          <div style={{ clear: 'both' }} />
          <br /> It can also be good to know that I offer a 30-day money-back
          guarantee if you are not happy with the book.
        </p>
        <h3>About the author</h3>
        <img
          alt="Jakob Lind"
          className={styles.authorImage}
          src={require('../../images/profile-pic.jpg')}
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
        <p>A: I offer a 30-day no-questions-asked money-back guarantee</p>
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
          the book because there is a new version of webpack or if I extend the
          book with new material, you will get the update straight in your inbox
          with no additional cost.{' '}
        </p>
        <p>
          <b>Q: What formats do I get?</b>
        </p>
        <p>
          A: You'll get PDF and EPUB. If I sometime in the future offer more
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
