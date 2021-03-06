/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
/** @module Tools */

import {
  Tool, PluginUiProvider, PluginUiManager, UiItemNode,
} from "@bentley/imodeljs-frontend";
import {
  ActionItemInsertSpec, GroupItemInsertSpec,
  ToolbarItemInsertSpec, ToolbarItemType, BadgeType, ConditionalDisplayType,
} from "@bentley/ui-abstract";
import { SampleAppIModelApp, SampleAppUiActionId } from "../index";

/** alpha test code */
class TestUiProvider implements PluginUiProvider {
  public readonly id = "TestUiProvider";
  public provideToolbarItems(toolBarId: string, _itemIds: UiItemNode): ToolbarItemInsertSpec[] {
    // tslint:disable-next-line: no-console
    // console.log(`Requesting tools for toolbar ${toolBarId}`);

    if ("[ViewsFrontstage]ToolWidget-horizontal" === toolBarId) {
      const simpleActionSpec: ActionItemInsertSpec = {
        itemType: ToolbarItemType.ActionButton,
        itemId: "simple-test-action-tool",
        execute: (): void => {
          // tslint:disable-next-line: no-console
          console.log("Got Here!");
        },
        icon: "icon-developer",
        label: "simple-test-action-tool",
      };

      const childActionSpec: ActionItemInsertSpec = {
        itemType: ToolbarItemType.ActionButton,
        itemId: "child-test-action-tool",
        condition: {
          type: ConditionalDisplayType.Visibility,
          testFunc: (): boolean => SampleAppIModelApp.getTestProperty() !== "HIDE",
          syncEventIds: [SampleAppUiActionId.setTestProperty],
        },
        execute: (): void => {
          // tslint:disable-next-line: no-console
          console.log("Got Here!");
        },
        icon: "icon-developer",
        label: "child-test-action-tool",
      };

      const nestedActionSpec: ActionItemInsertSpec = {
        itemType: ToolbarItemType.ActionButton,
        parentToolGroupId: "tool-formatting-setting",
        itemId: "nested-test-action-tool",
        execute: (): void => {
          // tslint:disable-next-line: no-console
          console.log("Got Here!");
        },
        icon: "icon-developer",
        label: "test action tool (nested)",
      };

      const groupSpec: GroupItemInsertSpec = {
        itemType: ToolbarItemType.GroupButton,
        itemId: "test-tool-group",
        badge: BadgeType.TechnicalPreview,
        icon: "icon-developer",
        label: "test group",
        items: [childActionSpec, simpleActionSpec],
      };

      return [simpleActionSpec, nestedActionSpec, groupSpec];

    } else if ("[ViewsFrontstage]NavigationWidget-horizontal" === toolBarId) {
      const navHorizontalSpec: ActionItemInsertSpec = {
        itemType: ToolbarItemType.ActionButton,
        itemId: "nav1-test-action-tool",
        execute: (): void => {
          // tslint:disable-next-line: no-console
          console.log("Got Here!");
        },
        icon: "icon-developer",
        label: "test action tool (navH)",
      };
      return [navHorizontalSpec];
    } else if ("[ViewsFrontstage]NavigationWidget-vertical" === toolBarId) {
      const navVerticalSpec: ActionItemInsertSpec = {
        itemType: ToolbarItemType.ActionButton,
        itemId: "nav2-test-action-tool",
        execute: (): void => {
          // tslint:disable-next-line: no-console
          console.log("Got Here!");
        },
        icon: "icon-developer",
        label: "test action tool (navV)",
      };
      return [navVerticalSpec];
    }

    return [];
  }
}

/** An Immediate Tool that toggles the test ui provider defined above. */
export class UiProviderTool extends Tool {
  public static testPluginLoaded = "";

  public static toolId = "TestUiProvider";
  public run(_args: any[]): boolean {
    if (UiProviderTool.testPluginLoaded.length > 0) {
      PluginUiManager.unregister(UiProviderTool.testPluginLoaded);
      UiProviderTool.testPluginLoaded = "";
    } else {
      const testUiProvider = new TestUiProvider();
      PluginUiManager.register(testUiProvider);
      UiProviderTool.testPluginLoaded = testUiProvider.id;
    }
    return true;
  }
}

// used to test loading Plugin that provides  Ui items at startup
const testPluginLoadedAtStartup = false;
if (testPluginLoadedAtStartup) {
  const uiProvider = new TestUiProvider();
  PluginUiManager.register(uiProvider);
  UiProviderTool.testPluginLoaded = uiProvider.id;
}
