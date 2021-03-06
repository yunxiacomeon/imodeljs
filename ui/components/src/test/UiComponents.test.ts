/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
import { expect } from "chai";
import TestUtils from "./TestUtils";
import { UiComponents } from "../ui-components";

describe("UiComponents", () => {

  beforeEach(() => {
    TestUtils.terminateUiComponents();
  });

  it("i18n should throw Error without initialize", () => {
    expect(() => UiComponents.i18n).to.throw(Error);
  });

  it("i18nNamespace should return UiComponents", () => {
    expect(UiComponents.i18nNamespace).to.eq("UiComponents");
  });

  it("packageName should return ui-components", () => {
    expect(UiComponents.packageName).to.eq("ui-components");
  });

  it("translate should return the key (in test environment)", async () => {
    await TestUtils.initializeUiComponents();
    expect(UiComponents.translate("test1.test2")).to.eq("test1.test2");
    TestUtils.terminateUiComponents();
  });

});
