import os
import re


class PatchEngine:

    def apply(self, patch_str):
        
        # Strip outer markdown blocks if LLM still uses them
        match = re.search(r'```(?:xml)?\s*(.*?)\s*```', patch_str, re.DOTALL)
        if match:
            patch_str = match.group(1)
            
        pattern = re.compile(r'<file>\s*<path>(.*?)</path>\s*<content>(.*?)</content>\s*</file>', re.DOTALL)
        matches = pattern.findall(patch_str)
        
        if not matches:
            return False, "No valid <file> XML blocks found in the output."
            
        for path, content in matches:
            path = path.strip()
            content = content.strip() + '\n'
            
            os.makedirs(os.path.dirname(path) or '.', exist_ok=True)
            
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
                
        return True, ""