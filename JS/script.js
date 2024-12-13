'use strict';

const data = [
  {
    name: 'Иван',
    surname: 'Петров',
    phone: '+79514545454',
  },

  {
    name: 'Игорь',
    surname: 'Семёнов',
    phone: '+79999999999',
  },

  {
    name: 'Семён',
    surname: 'Иванов',
    phone: '+79800252525',
  },

  {
    name: 'Мария',
    surname: 'Попова',
    phone: '+79876543210',
  },
];

{
  const addContactData = (contact) => {
    data.push(contact);
    setStorage('contacts', contact);
  };
  const createContainer = () => {
    const container = document.createElement('div');
    container.classList.add('container');

    return container;
  };

  const createHeader = () => {
    const header = document.createElement('header');
    header.classList.add('header');

    const headerContainer = createContainer();

    header.append(headerContainer);
    header.headerContainer = headerContainer;

    return header;
  };

  const createLogo = title => {
    const h1 = document.createElement('h1');
    h1.classList.add('logo');
    h1.textContent = `Телефонный справочник ${title}`;

    return h1;
  };

  const createMain = () => {
    const main = document.createElement('main');
    main.classList.add('main');

    const mainContainer = createContainer();

    main.append(mainContainer);
    main.mainContainer = mainContainer;

    return main;
  };

  const createFooter = (title) => {
    const footer = document.createElement('footer');
    footer.classList.add('footer');

    const footerContainer = createContainer();
    footerContainer.textContent = `Все права защищены ©${title}`;

    footer.append(footerContainer);
    footer.footerContainer = footerContainer;

    return footer;
  };

  const createButtonsGroup = params => {
    const btnWrapper = document.createElement('div');
    btnWrapper.classList.add('btn-wrapper');

    const btns = params.map(({className, type, text}) => {
      const button = document.createElement('button');
      button.className = className;
      button.textContent = text;
      button.type = type;

      return button;
    });

    btnWrapper.append(...btns);

    return {
      btnWrapper,
      btns,
    };
  };

  const createTable = () => {
    const table = document.createElement('table');
    table.classList.add('table', 'table-striped');

    const thead = document.createElement('thead');
    thead.insertAdjacentHTML('beforeend', `
      <tr>
        <th class="delete">Удалить</th>
        <th class="edit"></th>
        <th>Имя</th>
        <th>Фамилия</th>
        <th>Телефон</th>
      </tr>
    `);

    const tbody = document.createElement('tbody');
    table.tbody = tbody;

    table.append(thead, tbody);

    return table;
  };

  const createForm = () => {
    const overlay = document.createElement('div');
    overlay.classList.add('form-overlay');

    const form = document.createElement('form');
    form.classList.add('form');
    form.insertAdjacentHTML('beforeend', `
      <button class="close" type="button"></button>
      <h2 class="form-title">Добавить контакт</h2>

      <div class="form-group">
        <label class="form-label" for="name">Имя:</label>
        <input class="form-input" name="name" id="name" type="text" required>
      </div>

      <div class="form-group">
        <label class="form-label" for="surname">Фамилия:</label>
        <input class="form-input" name="surname" id="surname" type="text" required>
      </div>

      <div class="form-group">
        <label class="form-label" for="phone">Телефон:</label>
        <input class="form-input" name="phone" id="phone" type="tel" required>
      </div>
    `);

    const buttonGroup = createButtonsGroup(
        [{
          className: 'btn btn-primary mr-3',
          type: 'submit',
          text: 'Добавить',
        },

        {
          className: 'btn btn-danger',
          type: 'reset',
          text: 'Отмена',
        }],
    );

    form.append(...buttonGroup.btns);
    overlay.append(form);

    return {
      overlay,
      form,
    };
  };

  const createRow = ({name: firstName, surname, phone}) => {
    const tr = document.createElement('tr');
    tr.classList.add('contact');

    const tdDel = document.createElement('td');

    const buttonDel = document.createElement('button');
    tdDel.classList.add('delete');
    tdDel.append(buttonDel);
    buttonDel.classList.add('del-icon');

    const tdname = document.createElement('td');
    tdname.textContent = firstName;

    const tdSurname = document.createElement('td');
    tdSurname.textContent = surname;

    const tdPhone = document.createElement('td');
    const phoneLink = document.createElement('a');
    phoneLink.href = `tel:${phone}`;
    phoneLink.textContent = phone;
    tr.phoneLink = phoneLink;

    const tdEdit = document.createElement('td');
    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-btn', 'btn-primary');
    editBtn.textContent = 'Редактировать';
    tdEdit.append(editBtn);

    tdPhone.append(phoneLink);
    tr.append(tdDel, tdEdit, tdname, tdSurname, tdPhone,);

    return tr;
  };

  const renderPhoneBook = (app, title) => {
    const header = createHeader();
    const logo = createLogo(title);
    const main = createMain();
    const buttonGroup = createButtonsGroup(
        [{
          className: 'btn btn-primary mr-3 js-add',
          type: 'button',
          text: 'Добавить',
        },

        {
          className: 'btn btn-danger',
          type: 'button',
          text: 'Удалить',
        }],
    );
    const table = createTable();
    const {form, overlay} = createForm();
    const footer = createFooter(title);

    header.headerContainer.append(logo);
    main.mainContainer.append(buttonGroup.btnWrapper, table, overlay);
    app.append(header, main, footer);

    return {
      list: table.tbody,
      logo,
      btnAdd: buttonGroup.btns[0],
      btnDel: buttonGroup.btns[1],
      formOverlay: overlay,
      form: form,
    };
  };

  const renderContacts = (elem, data) => {
    const allRow = data.map(createRow);
    elem.append(...allRow);

    return allRow;
  };

  const hoverRow = (allRow, logo) => {
    const text = logo.textContent;
    allRow.forEach(contact => {
      contact.addEventListener('mouseenter', () => {
        logo.textContent = contact.phoneLink.textContent;
      });

      contact.addEventListener('mouseleave', () => {
        logo.textContent = text;
      });
    });
  };

  const modalControl = (btnAdd, formOverlay) => {
    const openModal = () => {
      formOverlay.classList.add('is-visible');
    };

    const closeModal = () => {
      formOverlay.classList.remove('is-visible');
    };

    btnAdd.addEventListener('click', openModal);

    formOverlay.addEventListener('click', e => {
      const target = e.target;
      
      if (target === formOverlay || 
        target.classList.contains('close')) { 
        closeModal(); 
      }
    });

    return {
      closeModal,
    }
  };

  const deleteControl = (btnDel, list) => {
    btnDel.addEventListener('click', () => {
      document.querySelectorAll('.delete').forEach(del => {
        del.classList.toggle('is-visible');
      })
    });

    list.addEventListener('click', e => {
      console.log(e.target);
    });

    list.addEventListener('click', e => {
      const target = e.target;

      if (target.closest('.del-icon')) {
        const contact = target.closest('.contact');
        const phone = contact.querySelector('a').textContent;
        contact.remove();
        removeStorage(phone);
      }
    });
  };

  const addContactPage = (contact, list) => {
    list.append(createRow(contact));
  };

  const formControl = (form, list, closeModal) => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(form);
      const newContact = Object.fromEntries(formData);

      addContactPage(newContact, list);
      addContactData(newContact);

      form.reset();
      closeModal();
    });
  }

  // Получить данные из хранилища
  const getStorage = (key) => {
    const data = localStorage.getItem(key) // возвращает строку

    if (!data) {
      return [];
    };

    return JSON.parse(data);
  };

  // Записать данные в хранилище
  const setStorage = (key, obj) => {
    const arr = getStorage(key);
    arr.push(obj);

    localStorage.setItem(key, JSON.stringify(arr));
  };

  // Удалить данные из хранилища
  const removeStorage = (phone) => {
    const key = 'contacts';
    const arr = JSON.parse(localStorage.getItem(key));
    const remArr = arr.filter(item => item.phone !== phone);

    localStorage.setItem(key, JSON.stringify(remArr));
  };

  const init = (selectorApp, title) => {
    const app = document.querySelector(selectorApp);

    const {
      list, 
      logo, 
      btnAdd, 
      formOverlay, 
      form,
      btnDel,
    } = renderPhoneBook(app, title);

    const storageData = getStorage('contacts');
    const combineData = [...data, ...storageData];


    const allRow = renderContacts(list, combineData);

    const {closeModal} = modalControl(btnAdd, formOverlay);
    hoverRow(allRow, logo);
    deleteControl(btnDel, list);
    formControl(form, list, closeModal);
  };

  window.phoneBookInit = init;
}