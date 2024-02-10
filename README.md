# Booking chatbot

<img src="/media/demo.gif" alt="demo" width="30%" height="30%"/>

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
