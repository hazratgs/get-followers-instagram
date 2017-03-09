var webdriver = require('selenium-webdriver'),
    promise = webdriver.promise,
    By = webdriver.By,
    until = webdriver.until;

var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

driver.manage().window().setSize(375, 375);

var timeout = 4000;

driver.get('https://www.instagram.com/accounts/login/');
setTimeout(function () {
    driver.findElement(By.name('username')).sendKeys('pinetki_vsem');
    driver.findElement(By.name('password')).sendKeys('Dagestan05');
    driver.findElement(By.tagName('button')).click();

    setTimeout(function () {
        load();
    }, timeout)
}, timeout);


function load() {
    driver.get('https://www.instagram.com/myderbent_plus/');

    var followers = [];

    var handle = function () {
        var items = driver.findElements(By.css('a[title]'));

        items.then(function (elements) {
            var items = elements.map(function (elem) {
                return elem.getText();
            });

            promise.all(items).then(function (result) {
                console.log(result)
            });

        });

        driver.executeScript("document.querySelector('body').scrollTop = 100");
    };

    setTimeout(function () {
        driver.findElement(By.xpath('//*[@id="react-root"]/section/main/article/ul/li[2]/a')).click()

        setTimeout(function () {
            handle();
        }, timeout);
    }, timeout);
}


setTimeout(function () {

}, 60000)