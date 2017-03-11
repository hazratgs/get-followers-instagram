var fs = require('fs');

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
    var followers = [],
        id = 0,
        replay = 5;

    driver.get('https://www.instagram.com/myderbent_plus/').then(function () {

        var handle = function (skip) {
            if (!skip){
                driver.executeScript("document.querySelector('body').scrollTop = 200");
            }

            setTimeout(function () {

                /* Скролл вверх */
                driver.executeScript("document.querySelector('body').scrollTop = 0");

                /* Поиск загрузчика */
                driver.findElement(By.className('._lm3a0')).then(function(webElement) {

                    /* Есть загрузчик, ждем пока загрузит */
                    console.log('Loader...');
                    setTimeout(function () {
                        handle(skip);
                    }, 4000);

                }, function(err) {

                    /* Загрузчика нет, берем данные */
                    var items = driver.findElements(By.css('a[title]'));
                    items.then(function (elements) {

                        if (elements.length){

                            /* Элементы есть */
                            var items = elements.map(function (elem) {
                                return elem.getText();
                            });

                            promise.all(items).then(function (result) {
                                for (var key in result){
                                    id++;
                                    followers.push(result[key]);
                                    console.log(id + '. ' + result[key]);
                                }

                                /* Очищаем список */
                                driver.executeScript('document.querySelector("ul._ighw9").innerHTML = ""');
                                /* Удалять например, только li */

                                /* Переход на следующую страницу */
                                setTimeout(function () {
                                    handle();
                                }, 200);
                            });
                        } else {

                            /* Элементов нет... */
                            if (replay){
                                replay--;

                                console.log('Возможен обрыв соединения, повторная попытка ' + replay);
                                setTimeout(function () {
                                    handle();
                                }, 5000);

                            } else {

                                /* Запись данных в файл */
                                var filename = 'db.txt';
                                var str = JSON.stringify(followers, null, 4);

                                fs.writeFile(filename, str, function(err){
                                    if(err) {
                                        console.log(err)
                                    } else {
                                        console.log('Загрузка завершена, подписчики ('+ id +') записаны в файл db.txy');
                                    }
                                });
                            }
                        }
                    });
                });
            }, 400);
        };

        setTimeout(function () {
            driver.findElement(By.xpath('//*[@id="react-root"]/section/main/article/ul/li[2]/a')).click()

            setTimeout(function () {
                driver.executeScript('document.querySelector("ul._ighw9").style.minHeight = "250px"');
                handle(true);
            }, timeout);
        }, timeout);
    });
}

function isElementPresent(locator) {
    try {
        driver.findElement(locator);
        return true;
    } catch (e) {
        return false;
    }
}


setTimeout(function () {}, 6000000000)