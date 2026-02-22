from fastapi import FastAPI
from typing import List, Dict, Any
from pydantic import BaseModel

app = FastAPI()

class Node(BaseModel):
    id: str

class Edge(BaseModel):
    source: str
    target: str

class WorkflowPayload(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

def is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    """
    Check if the graph represented by nodes and edges is a DAG (Directed Acyclic Graph).
    Uses DFS-based cycle detection with color marking.
    """
    # Build adjacency list
    adjacency_list = {node.id: [] for node in nodes}
    for edge in edges:
        adjacency_list[edge.source].append(edge.target)
    
    # Color states: 0 = white (unvisited), 1 = gray (visiting), 2 = black (visited)
    colors = {node.id: 0 for node in nodes}
    
    def has_cycle(node_id):
        colors[node_id] = 1  # Mark as visiting
        for neighbor in adjacency_list[node_id]:
            if colors[neighbor] == 1:  # Back edge found (cycle detected)
                return True
            if colors[neighbor] == 0 and has_cycle(neighbor):  # Recursively check unvisited neighbors
                return True
        colors[node_id] = 2  # Mark as visited
        return False
    
    # Check for cycles starting from each unvisited node
    for node in nodes:
        if colors[node.id] == 0:
            if has_cycle(node.id):
                return False
    
    return True

@app.post('/pipelines/parse')
def parse_pipeline(workflow: WorkflowPayload):
    num_nodes = len(workflow.nodes)
    num_edges = len(workflow.edges)
    is_dag_result = is_dag(workflow.nodes, workflow.edges)
    
    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': is_dag_result
    }
