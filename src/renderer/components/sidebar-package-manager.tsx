import * as React from 'react';
import { Button, InputGroup, Tree, TreeNodeInfo } from '@blueprintjs/core';
import { AppState } from '../state';
import { observer } from 'mobx-react';

interface IState {
  search: string;
}

interface IProps {
  appState: AppState;
}

@observer
export class SidebarPackageManager extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      search: '',
    };
  }

  public addPackageToSearch = (event: React.KeyboardEvent) => {
    const { search } = this.state;
    const { appState } = this.props;
    if (event.key === 'Enter' && !!search) {
      // TODO: allow users to specify the package version
      appState.packages.set(search, '*');
      this.setState({ search: '' });
    }
  };

  public render() {
    return (
      <Tree
        contents={[
          {
            childNodes: [
              {
                id: '-1',
                label: (
                  <InputGroup
                    leftIcon="search"
                    placeholder="Add package"
                    fill
                    onChange={(event) =>
                      this.setState({ search: event.target.value })
                    }
                    onKeyPress={this.addPackageToSearch}
                    value={this.state.search}
                  />
                ),
              },
              ...this.renderPackages(),
            ],
            id: 'packages',
            hasCaret: false,
            icon: 'code-block',
            label: 'Packages',
            isExpanded: true,
          },
        ]}
      />
    );
  }

  public renderPackages = (): TreeNodeInfo[] => {
    const values: TreeNodeInfo[] = [];
    const { appState } = this.props;
    for (const pkg of appState.packages.keys()) {
      values.push({
        id: pkg,
        label: pkg,
        secondaryLabel: (
          <Button
            minimal
            icon="remove"
            onClick={() => appState.packages.delete(pkg)}
          />
        ),
      });
    }

    return values;
  };
}