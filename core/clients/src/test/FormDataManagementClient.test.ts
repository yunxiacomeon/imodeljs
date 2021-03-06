/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
import * as chai from "chai";
import { ClientRequestContext } from "@bentley/bentleyjs-core";
import { AuthorizationToken } from "../Token";
import { TestConfig } from "./TestConfig";
import { FormDataManagementClient, FormDefinition, FormInstanceData } from "../FormDataManagementClient";
import { AuthorizedClientRequestContext } from "../AuthorizedClientRequestContext";

chai.should();

describe.skip("FormDataManagementClient", () => {
  let requestContext: AuthorizedClientRequestContext;
  const formDataManagementClient: FormDataManagementClient = new FormDataManagementClient();
  const projectId: string = "0f4cf9a5-5b69-4189-b7a9-60f6a5a369a7";

  before(async function () {
    if (TestConfig.enableMocks)
      return;
    this.enableTimeouts(false);

    const authToken: AuthorizationToken = await TestConfig.login();
    const accessToken = await formDataManagementClient.getAccessToken(new ClientRequestContext(), authToken);
    requestContext = new AuthorizedClientRequestContext(accessToken);
  });

  it("should be able to retrieve Form Definitions (#integration)", async () => {
    const formDefinitions: FormDefinition[] = await formDataManagementClient.getFormDefinitions(requestContext, projectId);
    chai.assert(formDefinitions);
  });

  it("should be able to retrieve Risk Issue Form Definitions (#integration)", async () => {
    const formDefinitions: FormDefinition[] = await formDataManagementClient.getRiskIssueFormDefinitions(requestContext, projectId);
    chai.assert(formDefinitions);
  });

  it("should be able to create new Form Data (#integration)", async () => {
    const definitions: FormDefinition[] = await formDataManagementClient.getFormDefinitions(requestContext, projectId);
    const formDef = definitions[0];
    const formId = formDef.formId!;

    const formData = {
      formId,
      properties: {
        _ContainerId: "CivilTest.imodel",
        _CreatedDate: "2015-07-28T06:07:34Z",
        _Description: "Test FeatureDescription",
        _ItemId: "f76bd999504568fd6b076977440d34859be4e1f8",
        _ModifiedDate: "2015-07-28T06:07:34Z",
        _Subject: "Test Feature",
        _Classification: "Punchlist",
        _Discipline: "Issue",
        ApprovedBy: "Test ApprovedBy",
        ApprovedById: "Test ApprovedById",
      },
    } as FormInstanceData;

    const newFromData: FormInstanceData = await formDataManagementClient.postFormData(requestContext, formData, projectId, "Issue");
    chai.assert(newFromData);
  });

  it("should be able to create new Risk Issue Form Data (#integration)", async function () {
    if (TestConfig.enableMocks)
      this.skip();

    const definitions: FormDefinition[] = await formDataManagementClient.getRiskIssueFormDefinitions(requestContext, projectId);
    const formDef = definitions[0];

    const formId = formDef.formId!;
    const iModelId = "b702d44e-d8c0-4978-9a41-b6cdddcb5619";
    const elementId = "f76bd999504568fd6b076977440d34859be4e1f8";
    const properties: any = {
      _CreatedDate: "2015-07-28T06:07:34Z",
      _Description: "Test FeatureDescription",
      _ModifiedDate: "2015-07-28T06:07:34Z",
      _Subject: "Test Feature",
      AssignedTo: "Test AssignedTo",
      AssignedToId: "Test AssignedToId",
    };

    const newFromData: FormInstanceData = await formDataManagementClient.postRiskIssueFormData(requestContext, properties, projectId, iModelId, elementId, formId, "Issue");
    chai.assert(newFromData);
  });

  it("should be able to retrieve Form Data (#integration)", async function () {
    if (TestConfig.enableMocks)
      this.skip();

    const formData: FormInstanceData[] = await formDataManagementClient.getFormData(requestContext, projectId, "Issue");
    chai.assert(formData);
  });

  it("should be able to retrieve Risk Issue Form Data (#integration)", async function () {
    if (TestConfig.enableMocks)
      this.skip();

    const iModelId = "b702d44e-d8c0-4978-9a41-b6cdddcb5619";
    const formData: FormInstanceData[] = await formDataManagementClient.getRiskIssueFormData(requestContext, projectId, iModelId, "Issue");
    chai.assert(formData);
  });

});
