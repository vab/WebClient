const notifs = require('../../../e2e.utils/notifications');

module.exports = (customSuite, { message, editor, identifier }, options = {}) => {

    const { send = true,  subject = true } = options;

    describe('Composer simple message', () => {

        let borodin;

        it('should open a the composer', () => {
            editor.open();
            browser.sleep(500);
            editor.isOpened()
                .then((test) => {
                    borodin = editor.compose();
                    expect(test).toEqual(true);
                });
        });

        it('should create a new message', () => {
            borodin.content(message.body)
                .then((text) => {
                    expect(text).toEqual(message.body);
                });
        });

        it('should not display CC and BCC fields', () => {
            borodin.isVisible('CCList')
                .then((test) => {
                    expect(test).toEqual(false);
                });

            borodin.isVisible('BCCList')
                .then((test) => {
                    expect(test).toEqual(false);
                });
        });

        it('should add a recepient', () => {
            borodin.fillInput('ToList', message.ToList)
                .then((text) => {
                    expect(text).toEqual('');
                });
        });


        if (subject) {
            it('should add a subject', () => {
                const subject = `${message.Subject} - test:${identifier}`;
                borodin.fillInput('Subject', `${message.Subject} - test:${identifier}`)
                    .then((text) => {
                        expect(text).toEqual(subject);
                    });
            });
        }

        customSuite({ message, editor, identifier, borodin });

        if (send) {
            it('should send the message', () => {
                borodin.send()
                    .then(() => browser.sleep(5000))
                    .then(() => borodin.isOpened())
                    .then((editor) => {
                        expect(editor).toEqual(false);
                    });
            });

            it('should display a notfication', () => {
                notifs.message()
                    .then((msg) => {
                        expect(msg).toEqual('Message sent');
                    });
            });
        }
    });

};
