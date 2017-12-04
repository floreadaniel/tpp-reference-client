const { client } = require('nightwatch-cucumber');
const { defineSupportCode } = require('cucumber');

defineSupportCode(({ Given, Then, When }) => { // eslint-disable-line

  const devServer = 'http://localhost:8080';
  const accountsPath = `${devServer}/accounts`;
  const paymentCompletedPath = `${devServer}/payment-completed`;

  // clear local storage to remove any session tokens
  Given('I am not logged in', () => client
    .execute('window.localStorage.clear();'));

  Given('I am logged in', () => client
    .execute('window.localStorage.clear();')
    .url(devServer)
    .waitForElementVisible('#login', 5000)
    .click('button[name=login]'));

  Given('I visit the accounts path', () => client
    .url(accountsPath));

  Given('I visit the payment completed path', () => client
    .url(paymentCompletedPath));

  Given(/^I open the homepage$/, () => client
    .url(devServer)
    .waitForElementVisible('#app', 5000));

  Then(/^I see the Login page$/, () => client
    .waitForElementVisible('#login', 5000)
    .assert.containsText(
      'h1',
      'Login',
    ).assert.elementPresent('button[name=login]'));

  When('I login', () => client
    .click('button[name=login]')
    .waitForElementVisible('#activity-selection', 5000));

  When('I login with invalid credentials', () => client
    .waitForElementVisible('input[name=u]', 5000)
    .clearValue('input[name=u]')
    .setValue('input[name=u]', 'invalid-user')
    .click('button[name=login]'));

  When('I login and the server returns 500 error', () => client
    .waitForElementVisible('input[name=u]', 5000)
    .clearValue('input[name=u]')
    .setValue('input[name=u]', 'trigger-error')
    .click('button[name=login]'));

  Then('I see a login failure message', () => client
    .waitForElementVisible('.error', 5000)
    .assert.containsText(
      'div.header',
      'Invalid username or password',
    ));

  Then('I see a login server error message', () => client
    .waitForElementVisible('.error', 5000)
    .assert.containsText(
      'div.header',
      'We are having issues with our login system',
    ));

  When('I logout', () => client
    .click('button[name=logout]'));

  Then('I see the Redirection page', () => client
    .waitForElementVisible('#redirect', 300)
    .assert.containsText(
      'div.header',
      'Redirection',
    ));

  When('I wait some time', () => {});

  When('System removes the selected aspsp from LocalStore', () => client
    .execute(() => {
      window.localStorage.removeItem('selectedAspsp');
    }));

  Then('I see the Accounts page', () => client
    .waitForElementVisible('#accounts', 5000)
    .assert.containsText(
      'h1',
      'Accounts',
    ));

  Then('I see an Account balance', () => client
    .waitForElementVisible('.account', 5000)
    .waitForElementVisible('.balance-booked', 5000)
    .assert.containsText(
      '.balance-booked',
      '£5,800.00',
    ));
});
