# ft_transcendence
### Soon you will know that you’ve already known things
that you thought you didn’t know


![Build Status](https://img.shields.io/badge/build-passing-success?style=flat&logo=appveyor)

![](https://img.shields.io/badge/note-100%2F100-success?style=flat&logo=appveyor)

## Summary:
No more C! No more C++!
This project is about doing something you’ve never done before.
Remind yourself the beginning of your journey in computer science.
Look at you now. Time to shine!

## Mandatory part
This project is about creating a website for the mighty Pong contest!

## Overview
Thanks to your website, users will play Pong with others. You will provide a nice user
interface, a chat, and real-time multiplayer online games!

Your work has to comply with the following rules:

- Your website backend must be written in NestJS.
- The frontend must be written with a TypeScript framework of your choice.
- You are free to use any library you want to in this context. However, you must use
the latest stable version of every library or framework used in your project.
- You must use a PostgreSQL database. That’s it, no other database.
- Your website must be a single-page application. The user should be able to use the
Back and Forward buttons of the browser
- Your website must be compatible with the latest stable up-to-date version of
Google Chrome and one additional web browser of your choice.
- The user should encounter no unhandled errors and no warnings when browsing the
website.
- Everything has to be launch by a single call to: docker-compose up --build

### Security concerns
- Any password stored in your database must be hashed.
- Your website must be protected against SQL injections
-  You must implement some kind of server-side validation for forms and any user
input.
### User Account
- The user must login using the OAuth system of 42 intranet.
- The user should be able to choose a unique name that will be displayed on the
website.
- The user should be able to upload an avatar. If the user doesn’t upload an avatar,
a default one must be set.
- The user should be able to enable two-factor authentication. For instance,
Google Authenticator or sending a text message to their phone.
- The user should be able to add other users as friends and see their current status
(online, offline, in a game, and so forth).
- Stats (such as: wins and losses, ladder level, achievements, and so forth) have to
be displayed on the user profile.
- Each user should have a Match History including 1v1 games, ladder, and anything else useful. Anyone who is logged in should be able to consult it.
- 
### Chat
- Don’t implement the buffer management of the original printf().
- Your function has to handle the following conversions: cspdiuxX%
- Your function will be compared against the original printf().
- You must use the command ar to create your library.
Using the libtool command is forbidden.
- Your libftprintf.a has to be created at the root of your repository

##### You have to implement the following conversions:
- %c Prints a single character.
- %s Prints a string (as defined by the common C convention).
- %p The void * pointer argument has to be printed in hexadecimal format.
- %d Prints a decimal (base 10) number.
- %i Prints an integer in base 10.
- %u Prints an unsigned decimal (base 10) number.
- %x Prints a number in hexadecimal (base 16) lowercase format.
- %X Prints a number in hexadecimal (base 16) uppercase format.
- %% Prints a percent sign.

## Bonus part
###### You don’t have to do all the bonuses.
##### Bonus list:
- Manage any combination of the following flags: ’-0.’ and the field minimum width
under all conversions.
- Manage all the following flags: ’# +’ (Yes, one of them is a space)

## Installation

ft_printf requires gcc or any other c compiler

```sh
cd ft_printf
Make
./a.out
```
## Important 
This project was made on Mac OS you may encounter problems on other OS.\
This is the new subject, I did it a few years ago, it may not be exactly the same.

