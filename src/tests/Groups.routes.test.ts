import 'mocha';
import { before, after } from 'mocha';
import { expect } from 'chai';
import { Passwd } from "../classes/Passwd";
import { Group } from "../classes/Group";
import { createRequest, createResponse } from "node-mocks-http";

import GroupRoutes from "../routes/groups";
import PasswdUser from '../interfaces/PasswdUser';
import { finish } from "./finish";
import resetUtilities from "./resetUtilities";
import ErrorResponse from '../interfaces/ErrorResponse';
import GroupItem from '../interfaces/GroupItem';

describe("/groups - get all groups", ()=>{

    it("should return a list of all groups if all goes well", async ()=>{
        let request = createRequest();
        let response = createResponse();

        GroupRoutes.getAllGroups(request, response);

        //Wait for the call to be done
        await finish(response);
 
        expect(response.statusCode).to.be.equal(200);

        let responseData = response._getData() as GroupItem[];
        
        expect(Array.isArray(responseData)).to.be.true;
        expect(responseData.length).to.be.equal(23);
    });

    it("should return an appropriate status code and error message if the passwd file path is wrong", async ()=>{
        let newPath = "./doesnt/exist";
        Group.setPath(newPath);

        let request = createRequest();
        let response = createResponse();

        GroupRoutes.getAllGroups(request, response);

        //Wait for the call to be done
        await finish(response);

        expect(response.statusCode).to.be.equal(500);
        
        let responseData = response._getData() as ErrorResponse;

        expect(responseData.code).to.be.ok;
        expect(responseData.code).to.be.equal("GROUP_FILE_LOCATION_ERROR");
        expect(responseData.message).to.be.equal("Something went wrong reading the group file");
    });

    it("should return an appropriate status code and error message if the group file can not be parsed", async ()=>{
        Group.setLineDelimiter("\t");

        let request = createRequest();
        let response = createResponse();

        GroupRoutes.getAllGroups(request, response);

        //Wait for the call to be done
        await finish(response);

        expect(response.statusCode).to.be.equal(500);

        let responseData = response._getData() as ErrorResponse;

        expect(responseData.code).to.be.ok;
        expect(responseData.code).to.be.equal("GROUP_PARSE_ERROR");
        expect(responseData.message).to.be.equal('There was an issue parsing the group file');
    });

    beforeEach(()=>{
        resetUtilities();
    });
});

describe("/groups/query - Query for groups", ()=>{

    it("should get expected groups based on queries being passed in", async ()=>{
        let request = createRequest({
            query: {
                name: 'sambashare'
            }
        });
        let response = createResponse();

        GroupRoutes.queryForGroups(request, response);

        //Wait for the call to be done
        await finish(response);
 
        expect(response.statusCode).to.be.equal(200);

        let responseData = response._getData() as GroupItem[];
        
        expect(Array.isArray(responseData)).to.be.true;
        expect(responseData.length).to.be.equal(1);
        expect(responseData[0].name).to.be.equal("sambashare");
        expect(responseData[0].members.length).to.be.equal(2);
    });

    it("should return an empty array if no such groups match", async ()=>{
        let request = createRequest({
            query: {
                name: 'doesntexist'
            }
        });
        let response = createResponse();

        GroupRoutes.queryForGroups(request, response);

        //Wait for the call to be done
        await finish(response);
 
        expect(response.statusCode).to.be.equal(200);

        let responseData = response._getData() as GroupItem[];
        
        expect(Array.isArray(responseData)).to.be.true;
        expect(responseData.length).to.be.equal(0);
    });

    it("should return an appropriate status code and error message if the passwd file path is wrong", async ()=>{
        let newPath = "./doesnt/exist";
        Group.setPath(newPath);

        let request = createRequest();
        let response = createResponse();

        GroupRoutes.queryForGroups(request, response);

        //Wait for the call to be done
        await finish(response);

        expect(response.statusCode).to.be.equal(500);
        
        let responseData = response._getData() as ErrorResponse;

        expect(responseData.code).to.be.ok;
        expect(responseData.code).to.be.equal("GROUP_FILE_LOCATION_ERROR");
        expect(responseData.message).to.be.equal("Something went wrong reading the group file");
    });

    it("should return an appropriate status code and error message if the group file can not be parsed", async ()=>{
        Group.setLineDelimiter("\t");

        let request = createRequest();
        let response = createResponse();

        GroupRoutes.queryForGroups(request, response);

        //Wait for the call to be done
        await finish(response);

        expect(response.statusCode).to.be.equal(500);

        let responseData = response._getData() as ErrorResponse;

        expect(responseData.code).to.be.ok;
        expect(responseData.code).to.be.equal("GROUP_PARSE_ERROR");
        expect(responseData.message).to.be.equal('There was an issue parsing the group file');
    });

    beforeEach(()=>{
        resetUtilities();
    });
});

describe("/group/:gid - Specific group", ()=>{

    it("should get the expected group based on gid", async ()=>{
        let request = createRequest({
            params: {
                gid: 121
            }
        });
        let response = createResponse();

        GroupRoutes.getSpecificGroup(request, response);

        //Wait for the call to be done
        await finish(response);
 
        expect(response.statusCode).to.be.equal(200);

        let responseData = response._getData() as GroupItem;
        
        expect(responseData.name).to.be.equal("scanner");
        expect(responseData.members.indexOf("saned")).to.not.equal(-1);
    });

    it("should return a status code of 404 if no such group is found", async ()=>{
        let request = createRequest({
            params: {
                gid: 9999
            }
        });
        let response = createResponse();

        GroupRoutes.getSpecificGroup(request, response);

        //Wait for the call to be done
        await finish(response);
 
        expect(response.statusCode).to.be.equal(404);
    });

    it("should return an appropriate status code and error message if the passwd file path is wrong", async ()=>{
        let newPath = "./doesnt/exist";
        Group.setPath(newPath);

        let request = createRequest();
        let response = createResponse();

        GroupRoutes.getSpecificGroup(request, response);

        //Wait for the call to be done
        await finish(response);

        expect(response.statusCode).to.be.equal(500);
        
        let responseData = response._getData() as ErrorResponse;

        expect(responseData.code).to.be.ok;
        expect(responseData.code).to.be.equal("GROUP_FILE_LOCATION_ERROR");
        expect(responseData.message).to.be.equal("Something went wrong reading the group file");
    });

    it("should return an appropriate status code and error message if the group file can not be parsed", async ()=>{
        Group.setLineDelimiter("\t");

        let request = createRequest();
        let response = createResponse();

        GroupRoutes.getSpecificGroup(request, response);

        //Wait for the call to be done
        await finish(response);

        expect(response.statusCode).to.be.equal(500);

        let responseData = response._getData() as ErrorResponse;

        expect(responseData.code).to.be.ok;
        expect(responseData.code).to.be.equal("GROUP_PARSE_ERROR");
        expect(responseData.message).to.be.equal('There was an issue parsing the group file');
    });


    beforeEach(()=>{
        resetUtilities();
    });
});