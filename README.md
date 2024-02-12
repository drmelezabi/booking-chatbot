# Booking chatbot

<img src="/media/demo.gif" alt="demo" width="35%" height="35%"/>

## Features

- **user UI**
  - Arabic language.
  - Stickers and style custom messages for every student and gender.
  - Help guide menu.
- **connect database account with user phone number**:
  - Many users type -> *"student - teacher - employee - security"*
  - Many user permissions -> *"super admin - admin - user"*
  - Deferent experience for every user.
  - Remember user chat.
  - Deferent menu for every user *"type - permission"*
- **Book reservations**:
  - Book available time and room.
    - The app can understand any way of reservation asking even slang arabic:
      *"عايز احجز ميعاد بكرة الساعة 5 في اوضه 105",*
      *"ميعاد يوم 18 فبراير الساعة 7 الصبح في معمل ج",*
      *"بعد بكرة 11 ص 106",*
      *"حجز موعد غدا في التاسعة صباحاً",*
      *"الساعة 12 الضهر في 109 الثلاث الجاي"*
        *and more ...*
  - One reservation per time *"next reservation available after activate the current one"*.
  - Cancel reservation: with maximum time to be able to cancel.
  - Replace reservation's user.
  - Active reservations *"by supervisor"* using pin code
- **Track reservations and missed reservation**.
  - Check today.
  - Check rest of today.
  - Check specific week day.
  - Check specific date.
- **Backup & Restore**
  - variation options to create.
    - Whatsapp: get the backup file.
    - Email: get the backup file.
    - Cloud: create backup on firebase.
  - restore throw:
    - whatsapp: by send backup file.
    - cloud
- **Control reservation availability**:
  - Block specific:
    - day *"ex. oral exam's day"*
    - date *"ex. 1 may every year"*
    - period : *"ex. summer period"*
- punishment for violate rules several time.
- **Terminate reservation for a day** *"super admin only"*
- **Group** -> *app only can send messages*
  - app will create group automatically when use the new number and ad customization for it
  - announcement for every
    - Reservation *"create - cancel - replace - activation"*
    - Call student when student delay
    - Blocking violated student and reason
    - New registration
- **customizable Rules**.
- **security**:
  - Not accept media from users.
  - Permission check.

## Requirements & Setup

- **Google account:**
  - **Firebase project** 🔔 *You may need to check the security issus and set your rules*
    - create new project
    - create credentials and get this values "apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId"
    - use the previous values as environment variable inside `.env` file
  - **google sheet service**
    - make connection between Google sheet and google cloud project inside [cloud console](https://console.cloud.google.com/)
      - Create new project and call it whatever you want and select this project
      - Add "Google Sheets API" service to it's "API/Service" tab:
        - APIs & Services -> ENABLE APIS AND SERVICES -> search for "Google Sheets API" -> Press "Enable"
      - inside "Google Sheets API" page side bar -> "Credentials"
      - Choose "CREATE CREDENTIALS" -> Service Account -> complete data 🔔 *some data are optional*
      - Now inside "CREATE CREDENTIALS" -> Service Accounts -> you should find mail ends with this pattern "iam.gserviceaccount.com" user it as "GOOGLE_SERVICE_ACCOUNT_EMAIL" variable in `.env` file
      - Press on the email and go to Keys -> ADD KEY -> Create new key -> JSON -> it will download `json file` -> open it and get the "private_key" and use it as as "GOOGLE_PRIVATE_KEY"
    - create sheet & give the "GOOGLE_SERVICE_ACCOUNT_EMAIL" editor permissions
      - open google sheet -> create new spreadsheet and you can name it whatever you want -> share it with "GOOGLE_SERVICE_ACCOUNT_EMAIL" that you've already gotten and make it as "editor"
      - inside this spreadsheet make this sheets:
        - teachers, managers, securities, first-grade-c, first-grade-y, second-grade-c, second-grade-y, third-grade-c, third-grade-y, fourth-grade-c, fourth-grade-y
        - for each sheet you need four columns head
          - fullName: string
          - shortName: string
          - gender: enum -> male, female  🔔 *You can make it as Drop menu*
          - permissions: enum -> user, admin, superAdmin 🔔 *You can make it as Drop menu*
        - NOW you can fill sheets with dat 🔔 *Later inside the chatbot you can give any other google account access to edit the sheet*
  - google Email service
    - use google Email address to send bugs and backup files 🔔 *i prefer to use another email address but it's up to you*
      - USe the "EMAIL_ADDRESS" and it's password as "SERVICE_APP_PASSWORD" inside `.env` file
    - email address to receive the mails from the previous one
      - it's for developers so you can write your Email *at any email service provider* address as "ADMINISTRATION_EMAIL"

  - You need real phone number 🔒 only for this service" and it should work on some smart phone and ready to scan the QR code from the terminal.

### install & Run the chatBot app

- you need [pnpm](https://pnpm.io/) to work with this nodejs project **Don't use npm or yarn**
- i highly recommend using docker if you have deferent node version to avoid app crash.
- you can run `pnpm new` to install and run the app if you are using `windows` operating system
- if not you need to run
  - `pnpm i`
  - `pnpm start`
