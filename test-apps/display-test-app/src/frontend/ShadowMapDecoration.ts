/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
import {
  DecorateContext,
  GraphicBranch,
  GraphicType,
  IModelApp,
  RenderGraphic,
  RenderGraphicOwner,
  Target,
  Tool,
  Viewport,
} from "@bentley/imodeljs-frontend";
import { parseToggle } from "@bentley/frontend-devtools";

class ShadowMapDecoration {
  private static _instance?: ShadowMapDecoration;
  private readonly _vp: Viewport;
  private readonly _graphics: RenderGraphic[] = [];
  private _removeMe?: () => void;

  private get _target(): Target { return this._vp.target as Target; }

  private constructor(vp: Viewport) {
    this._vp = vp;
    this._target.solarShadowMap.onGraphicsChanged = (gfx) => this.onGraphicsChanged(gfx);
    vp.onChangeView.addOnce(() => ShadowMapDecoration.stop());
    this._removeMe = IModelApp.viewManager.addDecorator(this);
  }

  private stop(): void {
    if (undefined !== this._removeMe) {
      this._removeMe();
      this._removeMe = undefined;
      for (const gf of this._graphics) {
        gf.dispose();
        if (gf instanceof RenderGraphicOwner)
          gf.disposeGraphic();
      }

      this._graphics.length = 0;
    }

    this._target.solarShadowMap.onGraphicsChanged = undefined;
    IModelApp.viewManager.invalidateDecorationsAllViews();
  }

  public decorate(context: DecorateContext): void {
    const vp = context.viewport;
    if (this._vp === vp || !this._vp.view.isSpatialView() || !vp.view.isSpatialView())
      return;

    for (const gf of this._graphics)
      context.addDecoration(GraphicType.WorldDecoration, gf);
  }

  private onGraphicsChanged(gfx: RenderGraphic[]): void {
    this._graphics.length = 0;
    for (const gf of gfx) {
      // Hack: GraphicBranch will be disposed, which empties out its array of graphics. Copy them.
      const branch = (gf as any).branch as GraphicBranch;
      if (undefined === branch || !(branch instanceof GraphicBranch)) {
        this._graphics.push(gf);
        continue;
      }

      const copy = new GraphicBranch(false);
      copy.symbologyOverrides = this._target.currentFeatureSymbologyOverrides;
      for (const entry of branch.entries)
        copy.add(entry);

      const copyGf = IModelApp.renderSystem.createBranch(copy, (gf as any).localToWorldTransform);
      const owner = IModelApp.renderSystem.createGraphicOwner(copyGf);
      this._graphics.push(owner);
    }

    IModelApp.viewManager.invalidateDecorationsAllViews();
  }

  public static toggle(vp: Viewport, enabled?: boolean): void {
    const cur = ShadowMapDecoration._instance;
    if (undefined !== enabled) {
      if ((undefined !== cur) === enabled)
        return;
    }

    if (undefined === cur) {
      ShadowMapDecoration._instance = new ShadowMapDecoration(vp);
    } else {
      cur.stop();
      ShadowMapDecoration._instance = undefined;
    }
  }

  public static stop(): void {
    const cur = ShadowMapDecoration._instance;
    if (undefined !== cur) {
      cur.stop();
      ShadowMapDecoration._instance = undefined;
    }
  }
}

/** Decorates all other viewports with the tiles selected for drawing the selected viewport's shadow map. */
export class ToggleShadowMapTilesTool extends Tool {
  public static toolId = "ToggleShadowMapTiles";
  public static get minArgs() { return 0; }
  public static get maxArgs() { return 1; }

  public run(enable?: boolean): boolean {
    const vp = IModelApp.viewManager.selectedView;
    if (undefined !== vp && vp.view.isSpatialView())
      ShadowMapDecoration.toggle(vp, enable);

    return true;
  }

  public parseAndRun(...args: string[]): boolean {
    const enable = parseToggle(args[0]);
    if (typeof enable !== "string")
      this.run(enable);

    return true;
  }
}
