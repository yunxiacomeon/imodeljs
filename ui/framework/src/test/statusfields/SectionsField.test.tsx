/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
import * as React from "react";
import { mount } from "enzyme";
import { expect } from "chai";
// import * as sinon from "sinon";
import { Provider } from "react-redux";

import { MockRender } from "@bentley/imodeljs-frontend";

import TestUtils from "../TestUtils";
import { WidgetState, WidgetDef } from "../../ui-framework/widgets/WidgetDef";
import { ConfigurableUiControlType, ConfigurableCreateInfo } from "../../ui-framework/configurableui/ConfigurableUiControl";
import { StatusBarWidgetControl, StatusBarWidgetControlArgs } from "../../ui-framework/statusbar/StatusBarWidgetControl";
import { SectionsStatusField } from "../../ui-framework/statusfields/SectionsField";
import { StatusBar } from "../../ui-framework/statusbar/StatusBar";

describe("SectionsField", () => {
  class AppStatusBarWidgetControl extends StatusBarWidgetControl {
    constructor(info: ConfigurableCreateInfo, options: any) {
      super(info, options);
    }

    public getReactNode({ isInFooterMode, onOpenWidget, openWidget }: StatusBarWidgetControlArgs): React.ReactNode {
      return (
        <>
          <SectionsStatusField isInFooterMode={isInFooterMode} onOpenWidget={onOpenWidget} openWidget={openWidget} />
        </>
      );
    }
  }

  let widgetControl: StatusBarWidgetControl | undefined;

  before(async () => {
    await TestUtils.initializeUiFramework();
    MockRender.App.startup();

    const statusBarWidgetDef = new WidgetDef({
      classId: AppStatusBarWidgetControl,
      defaultState: WidgetState.Open,
      isFreeform: false,
      isStatusBar: true,
    });
    widgetControl = statusBarWidgetDef.getWidgetControl(ConfigurableUiControlType.StatusBarWidget) as StatusBarWidgetControl;
  });

  after(() => {
    MockRender.App.shutdown();
    TestUtils.terminateUiFramework();
  });

  it("should render", () => {
    const wrapper = mount(<Provider store={TestUtils.store}>
      <StatusBar widgetControl={widgetControl} isInFooterMode={true} />
    </Provider>);

    wrapper.unmount();
  });

  it("should open/close on click", () => {
    const wrapper = mount(<Provider store={TestUtils.store}>
      <StatusBar widgetControl={widgetControl} isInFooterMode={true} />
    </Provider>);

    // Simulate a click to open the pop-up dialog
    wrapper.find("div.uifw-indicator-icon").simulate("click"); // Opens it
    wrapper.update();

    expect(wrapper.find("div.uifw-sections-footer-contents").length).to.eq(1);

    wrapper.find("div.uifw-indicator-icon").simulate("click"); // Closes it
    wrapper.update();

    wrapper.unmount();
  });

});
