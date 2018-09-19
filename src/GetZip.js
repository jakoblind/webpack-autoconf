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
        const { projectname } = this.props;

        return (
            <div>
                <a className={styles.myButton} href="#" onClick={this.open}><img alt="zip-file" className={styles.icon} src={require("../images/zip.svg")}/>Get your project as a zip!</a>

                <Modal
                    isOpen={this.state.isOpen}
                    onRequestClose={this.close}
                    style={customStyles}
                    contentLabel="Example Modal" >
                    <h2 ref={subtitle => this.subtitle = subtitle}>Get the code straight to your inbox!</h2>
                    <p>You'll also get fresh articles about Redux/React a few times per month.</p>
                     <div className={styles.signupFormArea}>
                      <form action="https://www.getdrip.com/forms/746048472/submissions" method="post" data-drip-embedded-form="746048472">
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
                        <input type="hidden" name="fields[webpack_features]" value={projectname}/>
                        <div className={styles.signupButtonArea}>
                            <input
                                 className={styles.myButton}
                                 type="submit"
                                 value="Send me the project!"
                                data-drip-attribute="sign-up-button" />
                        </div>
                        <a href="#" onClick={this.close}>No thanks, I rather copy/paste it</a>
                      </form>
                    </div>
                    <div className={styles.zipIconArea}>
                        <div className={styles.zipIcon}>
                             <img alt="zip icon" src={require("../images/zip-icon.png")}/>
                             <div>{projectname}.zip</div>
                              </div>

            </div>
                    </Modal>
            </div>
        );
    }
}
export default GetZip;
