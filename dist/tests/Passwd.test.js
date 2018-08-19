"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const mocha_1 = require("mocha");
const chai_1 = require("chai");
describe("Passwd - Instantiation", () => {
    it("should return an instance of Passwd when calling getInstance()", () => {
        let Passwd = require('../classes/Passwd').Passwd;
        let passwd = Passwd.getInstance();
        chai_1.expect(passwd instanceof Passwd).to.be.true;
    });
    it("should return the same instance irregardless of how often one calls getInstance()", () => {
        let Passwd = require('../classes/Passwd').Passwd;
        let passwd_one = Passwd.getInstance();
        let passwd_two = Passwd.getInstance();
        chai_1.expect(passwd_one instanceof Passwd).to.be.true;
        chai_1.expect(passwd_two instanceof Passwd).to.be.true;
        chai_1.expect(passwd_one).to.equal(passwd_two);
    });
});
describe("Passwd - Getters/Setters", () => {
    let Passwd = require('../classes/Passwd').Passwd;
    it("- getPath - should get the currently assigned path", () => {
        Passwd.setPath("/etc/passwd");
        chai_1.expect(Passwd.getPath()).to.be.equal("/etc/passwd");
    });
    it("- setPath - should set the currently assigned path", () => {
        let newPath = "some/new/path";
        chai_1.expect(Passwd.setPath(newPath)).to.not.throw;
        chai_1.expect(Passwd.getPath()).to.be.equal(newPath);
    });
    it("- getLineDelimiter - should get the line delimiter", () => {
        Passwd.setLineDelimiter("\n");
        chai_1.expect(Passwd.getLineDelimiter()).to.be.equal("\n");
    });
    it("- setLineDelimiter - should set the line delimiter", () => {
        let newDelimiter = "|";
        chai_1.expect(Passwd.setLineDelimiter(newDelimiter)).to.not.throw;
        chai_1.expect(Passwd.getLineDelimiter()).to.be.equal(newDelimiter);
    });
    it("- getColumnDelimiter - should get the column delimiter", () => {
        Passwd.setColumnDelimiter(":");
        chai_1.expect(Passwd.getColumnDelimiter()).to.be.equal(":");
    });
    it("- setColumnDelimiter - should set the column delimiter", () => {
        let newDelimiter = "_";
        chai_1.expect(Passwd.setColumnDelimiter(newDelimiter)).to.not.throw;
        chai_1.expect(Passwd.getColumnDelimiter()).to.be.equal(newDelimiter);
    });
    mocha_1.after(() => {
        Passwd.setPath("/etc/passwd");
        Passwd.setLineDelimiter("\n");
        Passwd.setColumnDelimiter(":");
    });
});
describe("Passwd - getAllUsers", () => {
    let Passwd = require('../classes/Passwd').Passwd;
    let passwd = Passwd.getInstance();
    it("should return an array of objects", () => __awaiter(this, void 0, void 0, function* () {
        let users = yield passwd.getAllUsers();
        chai_1.expect(users).to.be.ok;
        chai_1.expect(Array.isArray(users)).to.be.true;
    }));
    it("should return the correct number of members", () => __awaiter(this, void 0, void 0, function* () {
        Passwd.setPath("./src/tests/fake.passwd");
        let users = yield passwd.getAllUsers();
        chai_1.expect(users).to.be.ok;
        chai_1.expect(users.length).to.be.equal(25);
    }));
    it("each object should return a username, uid, gid, comment, home directory, and shell", () => __awaiter(this, void 0, void 0, function* () {
        let users = yield passwd.getAllUsers();
        chai_1.expect(users.length).to.be.ok;
        chai_1.expect(users.length).to.be.greaterThan(0);
        let user = users[0];
        chai_1.expect(user).to.be.ok;
        chai_1.expect(user.name).to.not.be.null;
        chai_1.expect(typeof user.name).to.be.equal("string");
        chai_1.expect(user.uid).to.not.be.null;
        chai_1.expect(typeof user.uid).to.be.equal("number");
        chai_1.expect(user.gid).to.not.be.null;
        chai_1.expect(typeof user.gid).to.be.equal("number");
        chai_1.expect(user.comment).to.not.be.null;
        chai_1.expect(typeof user.comment).to.be.equal("string");
        chai_1.expect(user.home).to.not.be.null;
        chai_1.expect(typeof user.home).to.be.equal("string");
        chai_1.expect(user.shell).to.not.be.null;
        chai_1.expect(typeof user.shell).to.be.equal("string");
    }));
    it("should return a member with information properly set", () => __awaiter(this, void 0, void 0, function* () {
        Passwd.setPath("./src/tests/fake.passwd");
        let users = yield passwd.getAllUsers();
        let keith = users[24];
        chai_1.expect(keith).to.be.ok;
        chai_1.expect(keith.name).to.be.equal("keith");
        chai_1.expect(keith.uid).to.be.equal(1000);
        chai_1.expect(keith.gid).to.be.equal(1000);
        chai_1.expect(keith.comment).to.be.equal("Keith Chester,,,");
        chai_1.expect(keith.home).to.be.equal("/home/keith");
        chai_1.expect(keith.shell).to.be.equal("/bin/bash");
    }));
    it("should fail if the passwd file does not exist", () => __awaiter(this, void 0, void 0, function* () {
        Passwd.setPath("/does/not/exist");
        // Note - normally you'd do a expect(fnc).to.throw() - can't do
        // that with async it seems?
        try {
            let users = yield passwd.getAllUsers();
        }
        catch (err) {
            chai_1.expect(err instanceof Error).to.be.true;
            chai_1.expect(err.message).to.be.equal(`Something went wrong reading the passwd file`);
            return; // We want to stop here
        }
        //We should never reach here due to the catch above
        chai_1.expect.fail();
    }));
    it("should fail if there is a problem parsing the passwd file", () => __awaiter(this, void 0, void 0, function* () {
        Passwd.setLineDelimiter("\t");
        Passwd.setColumnDelimiter("|");
        let users;
        try {
            users = yield passwd.getAllUsers();
        }
        catch (err) {
            chai_1.expect(err instanceof Error).to.be.true;
            chai_1.expect(err.message).to.be.equal("There was an issue parsing the passwd file");
            return;
        }
        //We should never reach here due to the catch above
        chai_1.expect.fail();
    }));
    afterEach(() => {
        Passwd.setPath("/etc/passwd");
        Passwd.setLineDelimiter("\n");
        Passwd.setColumnDelimiter(":");
    });
});
describe("Passwd - getUsersByQuery", () => {
    let Passwd = require('../classes/Passwd').Passwd;
    let passwd = Passwd.getInstance();
    it("should return an array with the correct members from the query", () => __awaiter(this, void 0, void 0, function* () {
        Passwd.setPath("./src/tests/fake.passwd");
        let queriedUsers = yield passwd.getUsersByQuery({ name: 'keith' });
        chai_1.expect(queriedUsers).to.be.ok;
        chai_1.expect(Array.isArray(queriedUsers)).to.be.true;
        chai_1.expect(queriedUsers.length).to.be.equal(1);
        let keith = queriedUsers[0];
        chai_1.expect(keith).to.be.ok;
        chai_1.expect(keith.name).to.be.equal("keith");
        chai_1.expect(keith.uid).to.be.equal(1000);
        chai_1.expect(keith.gid).to.be.equal(1000);
        chai_1.expect(keith.comment).to.be.equal("Keith Chester,,,");
        chai_1.expect(keith.home).to.be.equal("/home/keith");
        chai_1.expect(keith.shell).to.be.equal("/bin/bash");
    }));
    it("should return an emtpy array if no users match the query", () => __awaiter(this, void 0, void 0, function* () {
        Passwd.setPath("./src/tests/fake.passwd");
        let queriedUsers = yield passwd.getUsersByQuery({ name: "doesn't_exist" });
        chai_1.expect(queriedUsers).to.be.ok;
        chai_1.expect(Array.isArray(queriedUsers)).to.be.true;
        chai_1.expect(queriedUsers.length).to.be.equal(0);
    }));
    it("should allow querying by name", () => __awaiter(this, void 0, void 0, function* () {
        Passwd.setPath("./src/tests/fake.passwd");
        let queriedUsers = yield passwd.getUsersByQuery({ name: "daemon" });
        chai_1.expect(queriedUsers).to.be.ok;
        chai_1.expect(Array.isArray(queriedUsers)).to.be.true;
        chai_1.expect(queriedUsers.length).to.be.equal(1);
    }));
    it("should allow querying by uid", () => __awaiter(this, void 0, void 0, function* () {
        Passwd.setPath("./src/tests/fake.passwd");
        let queriedUsers = yield passwd.getUsersByQuery({ uid: 39 });
        chai_1.expect(queriedUsers).to.be.ok;
        chai_1.expect(Array.isArray(queriedUsers)).to.be.true;
        chai_1.expect(queriedUsers.length).to.be.equal(1);
    }));
    it("should allow querying by gid", () => __awaiter(this, void 0, void 0, function* () {
        Passwd.setPath("./src/tests/fake.passwd");
        let queriedUsers = yield passwd.getUsersByQuery({ gid: 34 });
        chai_1.expect(queriedUsers).to.be.ok;
        chai_1.expect(Array.isArray(queriedUsers)).to.be.true;
        chai_1.expect(queriedUsers.length).to.be.equal(1);
    }));
    it("should allow querying by comment", () => __awaiter(this, void 0, void 0, function* () {
        Passwd.setPath("./src/tests/fake.passwd");
        let queriedUsers = yield passwd.getUsersByQuery({ comment: "systemd Time Synchronization,,," });
        chai_1.expect(queriedUsers).to.be.ok;
        chai_1.expect(Array.isArray(queriedUsers)).to.be.true;
        chai_1.expect(queriedUsers.length).to.be.equal(1);
    }));
    it("should allow querying by home", () => __awaiter(this, void 0, void 0, function* () {
        Passwd.setPath("./src/tests/fake.passwd");
        let queriedUsers = yield passwd.getUsersByQuery({ home: "/home/keith" });
        chai_1.expect(queriedUsers).to.be.ok;
        chai_1.expect(Array.isArray(queriedUsers)).to.be.true;
        chai_1.expect(queriedUsers.length).to.be.equal(1);
    }));
    it("should allow querying by shell", () => __awaiter(this, void 0, void 0, function* () {
        Passwd.setPath("./src/tests/fake.passwd");
        let queriedUsers = yield passwd.getUsersByQuery({ shell: "/bin/bash" });
        chai_1.expect(queriedUsers).to.be.ok;
        chai_1.expect(Array.isArray(queriedUsers)).to.be.true;
        chai_1.expect(queriedUsers.length).to.be.equal(2);
    }));
    it("should allow querying by mixed attributes", () => __awaiter(this, void 0, void 0, function* () {
        Passwd.setPath("./src/tests/fake.passwd");
        let queriedUsers = yield passwd.getUsersByQuery({ name: 'keith', uid: 1000, gid: 1000, comment: "Keith Chester,,," });
        chai_1.expect(queriedUsers).to.be.ok;
        chai_1.expect(Array.isArray(queriedUsers)).to.be.true;
        chai_1.expect(queriedUsers.length).to.be.equal(1);
    }));
    it("should fail if the passwd file does not exist", () => __awaiter(this, void 0, void 0, function* () {
        Passwd.setPath("/does/not/exist");
        // Note - normally you'd do a expect(fnc).to.throw() - can't do
        // that with async it seems?
        try {
            let users = yield passwd.getAllUsers();
        }
        catch (err) {
            chai_1.expect(err instanceof Error).to.be.true;
            chai_1.expect(err.message).to.be.equal(`Something went wrong reading the passwd file`);
            return; // We want to stop here
        }
        //We should never reach here due to the catch above
        chai_1.expect.fail();
    }));
    it("should fail if there is a problem parsing the passwd file", () => __awaiter(this, void 0, void 0, function* () {
        Passwd.setLineDelimiter("\t");
        Passwd.setColumnDelimiter("|");
        let users;
        try {
            users = yield passwd.getAllUsers();
        }
        catch (err) {
            chai_1.expect(err instanceof Error).to.be.true;
            chai_1.expect(err.message).to.be.equal("There was an issue parsing the passwd file");
            return;
        }
        //We should never reach here due to the catch above
        chai_1.expect.fail();
    }));
    afterEach(() => {
        Passwd.setPath("/etc/passwd");
        Passwd.setLineDelimiter("\n");
        Passwd.setColumnDelimiter(":");
    });
});
