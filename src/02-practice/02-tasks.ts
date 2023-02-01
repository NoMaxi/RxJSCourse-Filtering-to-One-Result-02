import { addItem, run } from './../03-utils';
import {
    from,
    fromEvent,
    of,
    first,
    last,
    elementAt,
    min,
    max,
    find,
    findIndex,
    single,
    map,
    tap,
    catchError,
    EMPTY,
    ignoreElements,
    merge,
    throwError,
    mergeWith,
    concatMap,
} from 'rxjs';
import { ajax, AjaxResponse } from 'rxjs/ajax';

// Task 1. first()
// RU: Создайте поток объектов с двумя свойствами: action и priority
// Получите первый объект из потока с высоким приоритетом
// EN: Create an observable of objects with two properties: action and priority
// Get the first object from the observable with the high priority
(function task1(): void {
    const stream$ = from([
        { action: 'Create', priority: 'Low' },
        { action: 'Delete', priority: 'High' }
    ]).pipe(
        first(obj => obj.priority === 'High')
    );

    // run(stream$);
})();

// Task 2. last()
// RU: Создайте поток слов из предложения 'Мягкое слово кости не ломит'. 
// Получите последнее слово, которое содержит 6 символов
// EN: Create an observable of words from the sentence 'A soft word does not break bones'. 
// Get the last word that contains 6 characters
(function task2(): void {
    const str = 'A soft word does not break bones';
    const stream$ = from(str.split(' ')).pipe(
        last(word => word.length === 6, 'No words found')
    );

    // run(stream$);
})();


// Task 3. elementAt()
// RU: Создайте поток событий клик по документу. Получите второй объект события клик.
// EN: Create an observable of document click event. Get the second click event object.
(function task3(): void {
    const stream$ = fromEvent(document, 'click').pipe(
        elementAt(1)
    );

    // run(stream$, { outputMethod: "console" });
})();

// Task 4. min() (Vitalii Puzakov)
// RU: Создайте поток слов из предложения 'Мягкое слово кости не ломит'. 
// Найдите минимальную длину слова в предложении.
// EN: Create an observable of words from the sentence 'A soft word does not break bones'. 
// Find the minimum length of a word in a sentence.
(function task4() {
    const str = 'A soft word does not break bones';
    const stream$ = from(str.split(' ')).pipe(
        map(word => word.length),
        min()
    );

    // To find a word with minimum length:
    // const stream$ = from(str.split(" ")).pipe(
    //     min((a, b) => a.length < b.length ? -1 : 1)
    // );

    // run(stream$);
})();


// Task 5. max() (Ankit Katheriya)
// RU: Пусть у нас есть список проектов с датой начала и названием
// Мы хотим получить имя самого последнего запущенного проекта 
// EN: Let's we have a list of projects with started date and name 
// We want to get the name of the most recent(latest) started project
(function task5() {
    const source$ = from([
        {
            dateStart: '2020-04-13T00:00:00',
            ProjectId: '1',
            ProjectName: 'First',
        },
        {
            dateStart: '2020-07-05T00:00:00',
            ProjectId: '2',
            ProjectName: 'Second',
        },
        {
            dateStart: '2020-06-04T00:00:00',
            ProjectId: '3',
            ProjectName: 'Third',
        }
    ]);

    const stream$ = source$.pipe(
        max((a, b) => new Date(a.dateStart) < new Date(b.dateStart) ? -1 : 1),
        map(obj => obj.ProjectName)
    );

    // run(stream$);
})();

// Task 6. find() (Andrii Olepir)
// RU: Создайте поток, используя ajax(`https://jsonplaceholder.typicode.com/users`)
// Получите первого пользователя, email которого, заканчивается на 'biz'  
// EN: Create an observable using ajax(`https://jsonplaceholder.typicode.com/users`)
// Get the first user whose email ends with 'biz'
(function task6() {
    const stream$ = ajax('https://jsonplaceholder.typicode.com/users')
        .pipe(
            map(obj => obj.response),
            concatMap((arr: any) => from(arr)),
            find(user => user['email'].endsWith('.biz'))
        )
    ;

    // run(stream$, { outputMethod: "console" });
})();

// Task 6. find() (Maksym Novik)
// RU: Создайте поток, используя ajax(`https://dummyjson.com/products?limit=100`)
// Получите первый продукт из категории 'laptops', у которого рейтинг выше 4.5.
// Верните объект, который содержит заголовок, описание и цену полученного продукта.
// Если соответствующий продукт не найден, верните строку "Продукт не найден".
// EN: Create an observable using ajax(`https://dummyjson.com/products?limit=100`)
// Get the first product form 'laptops' category which rating is higher than 4.5.
// Return an object that contains the title, description, and price of the received product.
// If corresponding product was not found, return 'Product not found' string.
(function task6() {
    type Product = {
        id: number,
        title: string,
        description: string,
        price: number,
        discountPercentage: number,
        rating: number,
        stock: number,
        brand: string,
        category: string,
        thumbnail: string,
        images: string[]
    };
    type ProductsResponse = {
        products: Product[],
        total: number,
        skip: number
        limit: number,
    }
    const stream$ = ajax('https://dummyjson.com/products?limit=100')
        .pipe(
            map((obj: AjaxResponse<ProductsResponse>) => obj.response.products),
            concatMap(products => from(products)),
            find(({ category, rating }) => category === 'laptops' && rating >= 4.9),
            map((product) => {
                if (!product) {
                    return 'Product not found';
                }
                const { title, description, price } = product;
                return { title, description, price };
            })
        );

    // run(stream$, { outputMethod: 'console' });
})();

// Task7. findIndex()
// RU: Создайте поток объектов с двумя свойствами: id, name.
// Получите номер объекта в потоке, у которого длина name больше 10 символов  
// EN: Create an observable of object with two properties: id, name.
// Get the number of the object in the stream whose name is longer than 10 characters
(function task7() {
    const stream$ = from([
        { id: '1', name: 'Microsoft' },
        { id: '2', name: 'EPAM' },
        { id: '3', name: 'London Stock Exchange Group' },
        { id: '4', name: 'Facebook' }
    ]).pipe(
        findIndex(obj => obj.name.length > 10)
    );

    // run(stream$);
})();

// Task 8. single()
// RU: Создайте поток объектов с двумя свойствами: title, priority так, чтобы некоторые объекты
// имели одинаковые значения title
// Получите объект у которого title = 'Learn RxJS', если он единственный в потоке
// EN: Create an observable of objects with two properties: title, priority so that some objects
// have the same title values
// Get the object with title = 'Learn RxJS' if it's the only one object in the stream
(function task8() {
    const searchedTitle = 'Learn RxJS';
    const stream$ = from([
        { title: 'Learn JS', priority: 'High' },
        { title: 'Learn React', priority: 'Low' },
        { title: 'Learn React', priority: 'Low' },
        { title: searchedTitle, priority: 'Medium' },
        { title: 'Learn Angular', priority: 'Medium' }
    ]).pipe(
        single(obj => obj.title === searchedTitle)
    );

    // run(stream$);
})();

// Task 9. ignoreElements() (Uladzimir Miadzinski)
// RU: Создайте три потока, которые представляют результат выполнения запросов на три адреса
// https://app.com/logout, https://mail.app.com/logout, https://research.app.com/logout
// используя ajax().
// Предположим, пользователь разлогинивается на первом адресе. Необходимо запустить процесс разлогинивания
// пользователя на поддоменах и вывести на страницу результат работы.
// Если пользователь успешно разлогинился на всех адресах, вывести сообщение 
// 'Пользователь успешно разлогинен на всех поддоменах', если нет, то вывести сообшение
// 'Не удалось разлогинить пользователя на всех поддоменах'
// Использовать: ajax, of, mergeWith, tap, catchError, EMPTY
// Замените функцию ajax на of и понаблюдейте за результатом
// EN: Create three streams that represent the result of executing requests for three urls
// https://app.com/logout, https://mail.app.com/logout, https://research.app.com/logout
// using ajax().
// Let assume the user log out on the first domain. You need to start the logout process
// on subdomains and display the result of the process on the page.
// If the user successfully logged out on all urls, display a message
// 'User successfully logged out on all subdomains', if not, display a message
// 'Failed to logout user on all subdomains'
// Use: ajax, of, mergeWith, tap, catchError, EMPTY
// Replace the ajax function with of and watch the result
(function task9() {
    const successMessage = 'User successfully logged out on all subdomains';
    const errorMessage = 'Failed to logout user on all subdomains';

    // Real URLs to check the program functionality
    // const logout1$ = ajax("https://jsonplaceholder.typicode.com/users");
    // const logout2$ = ajax("https://jsonplaceholder.typicode.com/todos");
    // const logout3$ = ajax("https://jsonplaceholder.typicode.com/posts");
    const logout1$ = ajax('https://app.com/logout');
    const logout2$ = ajax('https://mail.app.com/logout');
    const logout3$ = ajax('https://research.app.com/logout');
    const stream$ = logout1$
        .pipe(
            mergeWith(logout2$, logout3$))
        .pipe(
            ignoreElements(),
            tap({
                error: () => addItem(errorMessage),
                complete: () => addItem(successMessage)
            }),
            catchError(() => EMPTY)
        );

    run(stream$);
})();

export function runner() {}
