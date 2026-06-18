import torch
import pprint

path = r"../Project Details/Models_NDB_UFES/calibrated_model.pth"
checkpoint = torch.load(path, map_location="cpu")

print(f"Type: {type(checkpoint)}")
if isinstance(checkpoint, dict):
    print("Keys in checkpoint:")
    for k in list(checkpoint.keys())[:10]:
        print(f"  {k}")
    print("...")
