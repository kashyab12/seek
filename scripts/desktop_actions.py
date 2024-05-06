from dataclasses import dataclass
from pathlib import Path
from desktop_parser import DesktopFile

@dataclass
class DesktopAction:
    app_path: Path
    def get_exec(self) -> Path:
        # Parse file
        desktop_file = DesktopFile.from_file(self.app_path)
        # todo: what's a more general solution? Find all and disp?
        cmd = list(find("Exec", desktop_file.__dict__))[0]
        print(cmd)
        return cmd
        
def find(key, value):
  for k, v in value.items():
    if k == key:
      yield v
    elif isinstance(v, dict):
      for result in find(key, v):
        yield result
    elif isinstance(v, list):
      for d in v:
        for result in find(key, d):
          yield result
