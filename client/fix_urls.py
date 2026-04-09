import os
import re

def fix_mismatched_quotes(directory):
    # This pattern looks for strings starting with the dynamic hostname and ending with a single or double quote
    # It captures the path part and replaces the ending quote with a backtick
    pattern = re.compile(r"(`http://\$\{window\.location\.hostname\}:5000[^'\"]*)(['\"])")
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.jsx') or file.endswith('.js'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = pattern.sub(r"\1`", content)
                
                if new_content != content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Fixed quotes in: {file}")

if __name__ == "__main__":
    fix_mismatched_quotes(r"d:\wishWings\client\src")
