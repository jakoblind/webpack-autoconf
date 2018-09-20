import React from 'react';
import Modal from 'react-modal';
import styles from "./styles.module.css";

const customStyles = {
  content : {
    top                   : '40%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

Modal.setAppElement('#___gatsby')

class GetZip extends React.Component {
    constructor() {
        super();

        this.state = {
            isOpen: false
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    open() {
        this.setState({isOpen: true});
    }

    close() {
        this.setState({isOpen: false});
    }
    render() {
        return (
            <div>
                <a className={this.props.linkStyles} href="#" onClick={this.open}>{this.props.linkText}</a>

                <Modal
                    isOpen={this.state.isOpen}
                    onRequestClose={this.close}
                    style={customStyles}
                    contentLabel="Example Modal" >
                    <div className={styles.modalContainer}>
                    <h2 ref={subtitle => this.subtitle = subtitle}>Time to learn webpack properly</h2>
                    <p>You have clicked around in this tool for a while. But you still can't wrap your head around how webpack works.</p>
<ul>
<li>"What is the .babelrc file?"</li>
<li>"What is a loader and what is a plugin? what's the difference?"</li>
<li>"They want me to put CSS and images in the bundle?!"</li>
</ul>

<p>To learn webpack properly you must get your hands dirty and do the work. It's not enough to glance over some generated webpack configs.</p>

<h3>Free webpack email course</h3>
<p>Yes, it's a build tool. Yes, you need a course to learn it.</p>

<p>With this email course you will learn webpack from the ground up. Using industry best practices. <i>And it's free!</i></p>

<p>You get 5 emails in 5 days.</p>
<ul>
<li>Lesson 1: What does webpack do? (an overview)</li>
<li>Lesson 2: Create your first webpack project</li>
<li>Lesson 3: The webpack.config.js and Babel</li>
<li>Lesson 4: Create a React app with webpack</li>
<li>Lesson 5: Styling with webpack</li>
</ul>

<p>Level up your frontend skills and become a more solid, all-round frontend dev. Sign up now!</p>
</div>
                     <div className={styles.signupFormArea}>
                      <form action="https://www.getdrip.com/forms/138671466/submissions" method="post" data-drip-embedded-form="138671466">
                        <div>
                            <input
                                autoFocus="true"
                                className={styles.signupField}
                                placeholder="Your Email"
                                type="email"
                                id="drip-email"
                                name="fields[email]" />
                        </div>
                        <div>
                            <input
                                className={styles.signupField}
                                placeholder="Your Name"
                                type="text"
                                id="drip-first-name"
                                name="fields[first_name]" />
                        </div>
                        <div className={styles.signupButtonArea}>
                            <input
                                 className={styles.myButton}
                                 type="submit"
                                 value="Enroll in the webpack course!"
                                data-drip-attribute="sign-up-button" />
                        </div>
                        <a href="#" onClick={this.close}>No thanks, I don't want to learn webpack</a>
                      </form>
                    </div>

                    </Modal>
            </div>
        );
    }
}
export default GetZip;
