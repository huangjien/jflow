import { useGithubContent } from '../lib/useGithubContent';
import RootLayout from './layout';
import { useTitle } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { IssueList } from '../components/IssueList';
import React, { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';

import 'reactflow/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Test Case 1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: 'Test Case 2' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export default function Home() {
  // const { tags, issues } = useGithubContent();
  // const { t } = useTranslation();
  // useTitle(t('header.home'));
  // return (
  //   <RootLayout>
  //     <IssueList tags={tags} data={issues} ComponentName={'Issue'} inTab="issue" />
  //   </RootLayout>
  // );
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { tags, issues } = useGithubContent();
  const { t } = useTranslation();
  useTitle(t('header.home'));

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <RootLayout>
      <div style={{ width: '100vw', height: '100vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
    </RootLayout>
  );
}
