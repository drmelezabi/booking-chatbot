# Booking chatbot

### Features
    - **user UI**
        * Arabic language.
        * stickers and style custom messages for every student and gender.
        * Help guide menu.
    - **connect database account with user phone number**:
        * many users type -> *"student - teacher - employee - security"*.
        * many user permissions -> *"super admin - admin - user"*.
        * deferent experience for every user.
        * remember user chat.
        * deferent menu for every user *"type - permission"*.
    - **Book reservations**:
        * book available time and room.
            > can understand any way of reservation asking even slang arabic
                # example:
                    "عايز احجز ميعاد بكرة الساعة 5 في اوضه 105",
                    "ميعاد يوم 18 فبراير الساعة 7 الصبح في معمل ج",
                    "بعد بكرة 11 ص في 106",
                    "حجز موعد غدا في التاسعة صباحاً",
                    "الساعة 12 الضهر في 109 الثلاث الجاي"
                    and more ...
        * book one reservation *"next reservation available after activate the current one"*.
        * cancel reservation: with maximum time to be able to cancel.
        * replace reservation's user.
        * Active reservations *"by supervisor"*
            > using pin code
    - **Track reservations and missed reservation**.
        * check today
        * check rest of today
        * check specific week day
        * check specific date
    - **Backup & Restore**
        * variation options to create
            > Whatsapp: get the backup file
            > Email: get the backup file
            > Cloud: create backup on firebase
        * restore throw:
            > whatsapp: by send backup file
            > cloud
    - **Control reservation availability**:
        * Block specific:
            > day *"ex. oral exam's day"*
            > date *"ex. 1 may every year"*
            > period : *"ex. summer period"*
        - punishment for violate rules several time.
    - **Terminate reservation for a day** *"super admin only"*
    - **Group** -> *app only can send messages*
        * app will create group automatically when use the new number and ad customization for it
        * announcement for every
            > Reservation "create - cancel - replace - activation"
            > call student when student delay
            > announce blocking rule's violated student
    - **customizable Rules**.
    - **security**:
        * Not accept media from users.
        * permission check.