#!/bin/bash

# List of files to update
FILES=(
  "resources/js/pages/youth-profiles/index.tsx"
  "resources/js/pages/youth-profiles/drafts/index.tsx"
  "resources/js/pages/youth-profiles/manage/index.tsx"
  "resources/js/pages/youth-profiles/pending/index.tsx"
  "resources/js/pages/youth-profiles/records/index.tsx"
  "resources/js/pages/youth-profiles/rejected/index.tsx"
)

# Add the Pagination import to each file
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    # Add import if it doesn't exist
    if ! grep -q "import { Pagination } from '@/components/pagination';" "$file"; then
      sed -i '' '/import { toast } from/a\
import { Pagination } from '\''@/components/pagination'\'';' "$file"
    fi
    
    # Replace the pagination section
    sed -i '' '/{\/\* Pagination \*\/}/,/^[[:space:]]*})/c\
            {/* Pagination */}\
            {profiles.last_page > 1 && (\
                <Pagination\
                    currentPage={profiles.current_page}\
                    lastPage={profiles.last_page}\
                    total={profiles.total}\
                    perPage={profiles.per_page}\
                    onPageChange={handlePageChange}\
                />\
            )}' "$file"
  fi
done 