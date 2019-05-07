import React from 'react'
import styles from '../styles.module.css'
import { Link } from 'gatsby'
import { SampleChapterSignupForm, withHidden } from '../components/SignupForms'
import Layout from '../components/layout'
import Countdown from 'react-countdown-now'

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

const renderer = ({ days, hours, minutes, seconds, completed }) => {
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
        <h3>Webpack configuration makes me feel really dumb</h3>
        <p>
          Webpack says it’s zero-config but that is only partly true. It’s
          zero-config if you don’t need any features at all. But if want to do
          anything non-trivial like, you know... creating an app that supports
          ES6 and styles then you are back to config hell.
        </p>
        <img
          src={require('../../images/webpackmedium.webm.gif')}
          width="100%"
          style={{ textAlgin: 'center' }}
        />
        <p>
          Loaders, plugins, rules, modules, resolve. What is what? And don’t get
          me started if you want code splitting and hot module reloading. And
          babel is supposed to be in there somehow.
        </p>
        <p>
          You do your best to set up the config by copy-pasting boilerplates,
          reading tutorials that might or might not be outdated, and reading the
          official docs which only partly answers the questions you have.
        </p>
        <div className={styles.twoColumns}>
          <div>
            <p>
              When you finally have managed to put together a webpack config
              that actually seems to work you don’t dare to touch it in case you
              break everything. Your webpack project is like a digital version
              of a house of cards (not the tv-series but you know... real cards)
            </p>

            <p>
              You are terrified when you change the code splitting setup or
              adding typescript - because everything might suddenly just fall
              apart.
            </p>
          </div>
          <img src={require('../../images/house-of-cards.jpg')} />
        </div>
        <p>
          Creating and maintaining frontend projects shouldn’t be this hard.
        </p>
        <p>
          You know webpack gets stuff done efficiently, but how many weeks or
          months do you have to spend to learn it properly?
        </p>
        <h3>With great complexity comes great power.</h3>
        <p>
          There is a reason that almost all major toolkits like Gatsby and
          Nextjs use webpack under-the-hood. There is a reason that webpack is
          so popular in enterprise applications, and large full stack and
          frontend apps.{' '}
        </p>
        <p>
          The reason is that webpack is super powerful. It’s ugly but it gets
          the job done better than any other tool. No build tool has the
          position that webpack has in the community - the user base is insanely
          big. It’s the industry standard whether you like it or not.
        </p>
        <p>
          Knowing webpack is one thing that will make you stand out from other
          frontend devs. Most devs have enough troubles to learn CSS grids
          layouts and ES6 features. Not everyone takes the time to learn
          webpack. If webpack was part of a Microsoft certification program
          (thank god it’s not) then this would be part of the Gold platinum
          certification.
        </p>
        <p>
          Webpack is tough to learn. You’ll have to do the work. But with the
          right learning resource you can be a confident webpack coder already
          next week.
        </p>
        <h3>A complete handbook for webpack beginners</h3>
        <p>
          In "Learn webpack", you'll start with a clean slate - just you and an
          empty text editor. You will learn step-by-step how to build the{' '}
          <code>webpack.config.js</code>, <code>package.json</code>,{' '}
          <code>.babelrc</code> and all other files required to build a modern
          web apps with webpack. This approach makes webpack super easy to learn
          - even if you don’t have much dev experience.
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
          <div style={{ clear: 'both' }} />
          <br /> It can also be good to know that I offer a 30-day money back
          guarantee if you are not happy with the book.
        </p>
        <h3>About the author</h3>
        <img
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
