/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
import * as React from "react";

import { Input, Button, NumericInput } from "@bentley/ui-core";
import "./MobxDemoView.scss";

interface MobxDemoViewProps {
  birds: string[];
  birdCount: number;
  setBirdName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  addBird: (event: React.FormEvent) => void;
  birdName: string;
  shouldDisableSubmit: boolean;
}

export class MobxDemoView extends React.Component<MobxDemoViewProps> {
  public render() {
    const {
      birds,
      birdCount,
      setBirdName,
      addBird,
      birdName,
      shouldDisableSubmit,
    } = this.props;

    return (
      <div className="mobx-demo-view">
        <h2>Bird Store</h2>
        <h3>You have {birdCount} birds.</h3>

        <form onSubmit={addBird}>
          <table>
            <tbody>
              <tr>
                <td><Input placeholder="Enter bird" value={birdName} onChange={setBirdName} className="bird-name" /></td>
                <td><Button disabled={shouldDisableSubmit}>Add bird</Button></td>
              </tr>
              <tr>
                <td><NumericInput className="numeric-input" min={-100} max={100} strict placeholder="Enter numeric value" /></td>
                <td>&nbsp;</td>
              </tr>
            </tbody>
          </table>
        </form>

        <ul>
          {
            birds.map((bird: string, index: number) => (
              <li key={index.toString()}>{bird}</li>
            ))
          }
        </ul>
      </div>
    );
  }
}
