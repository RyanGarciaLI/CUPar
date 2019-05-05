# CUPar-CSCI31000-Project
CSCI3100 Software Enigeering group project: CUPar

/**
 *  /sever.js
 *  Copyright (c) 2018-2019  CUPar Ltd.
 *  @author:  WEI Qi        <1155107666@link.cuhk.edu.hk>
 *            ZHAO Feng     <siegfriedzhaof@gmail.com>
 *            Ryan Yuxin LI <lyxnb2333@gmail.com>
 *            Jack Xiao     <jack123qd@hotmail.com>
 *            WEI Wang      <1155107718@link.cuhk.edu.hk>
 *  @version: 4.0
 *  @since 2019-03-19
 *  @last updated: 2019-05-04
 *
 * Here are some accounts preinstalled in the datebase for testing
 *        Test accounts     |     Password
 *     -------------------------------------------
 *          1155104321      |     zxczxc
 *          1155107777      |     zxczxc
 *          1155223344      |     zxczxc
 *     -------------------------------------------
 */

Catalogue：
.
├── node_modules
│   └── ...
├── package-lock.json
├── server.js
├── models 
│   └── user.js
├── plugin
│   ├── mailer.js
│   ├── database.js
│   ├── forumdb.js
│   └── encryption.js
├── public
│   ├── js
│      ├── reset.js
│      ├── entering.js
│      └── ...
│   └── ...
├── routes
│   ├── account.js
│   ├── chat.js
│   ├── check_roommate.js
│   ├── check_teammate.js
│   ├── forum.js
│   ├── index.js
│   ├── login.js
│   ├── logout.js
│   ├── post.js
│   ├── process_evaluate.js
│   ├── process_roommate.js
│   ├── process_teammate.js
│   ├── result_roommate.js
│   ├── result_teammate.js
│   └── signup.js
└── views
     ├── common
     │   ├── footer.ejs 
     │   └── header.ejs
     ├── 404.ejs
     ├── index.ejs
     ├── mypost.ejs
     ├── post.ejs
     ├── account.hbs
     ├── index.hbs
     ├── login.hbs
     ├── loginReset.hbs
     ├── NoRoommate.hbs
     ├── NoTeammate.hbs
     ├── sign-up.hbs
     ├── Teammate.hbs
     ├── Roommate.hbs
     ├── YesRoommate.hbs
     ├── YesTeammate.hbs
     ├── room.hbs
     ├── error.html
     ├── layout.html
     ├── sign-up.hbs
     ├── reset.hbs
     └── resetPwd.hbs


	CUPar is a platform helping CUHK students to find all kinds of partners. For CUHK students, there are mainly two kinds of partners they need to find: roommate and teammate. Besides, one may want to find friends to travel together, partners to join the workshop as a team, or someone to play sports after class. CUPar is designed to let students find roommate, teammate, and any kind of partners in an easier way.

	Codes about server are mainly in the route folder, except server.js. And we user node.js as the tool for our server. Documents about user interface are in the public and view folder. And we use the MySQL as our database. The details about our project are in our final report.

	By running the server.js in the root folder in cmd with node.js, you can use this software. 

