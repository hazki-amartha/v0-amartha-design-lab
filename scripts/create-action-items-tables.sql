-- Action tracker — replaces Google Sheets as primary store
CREATE TABLE IF NOT EXISTS action_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  tag          TEXT,
  product_area TEXT,
  owner        TEXT,
  status       TEXT NOT NULL DEFAULT 'backlog'
                 CHECK (status IN ('backlog', 'in_progress', 'released')),
  impact       TEXT CHECK (impact IN ('High', 'Medium', 'Low')),
  notes        TEXT,
  created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_action_items_status       ON action_items(status);
CREATE INDEX IF NOT EXISTS idx_action_items_product_area ON action_items(product_area);
CREATE INDEX IF NOT EXISTS idx_action_items_tag          ON action_items(tag);

ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on action_items" ON action_items
  FOR ALL USING (true) WITH CHECK (true);

-- Many-to-many link between issues and action items
CREATE TABLE IF NOT EXISTS issue_action_links (
  issue_id       UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  action_item_id UUID NOT NULL REFERENCES action_items(id) ON DELETE CASCADE,
  created_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (issue_id, action_item_id)
);

-- Fast lookup in both directions
CREATE INDEX IF NOT EXISTS idx_ial_action ON issue_action_links(action_item_id);

ALTER TABLE issue_action_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on issue_action_links" ON issue_action_links
  FOR ALL USING (true) WITH CHECK (true);
