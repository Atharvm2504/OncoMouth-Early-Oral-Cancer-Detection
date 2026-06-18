import torch
import torch.nn as nn
import timm

class OralCancerModel(nn.Module):
    """EfficientNetB3 + custom two-stage classification head."""

    def __init__(self, num_classes=3, pretrained=False, dropout=0.4):
        super().__init__()
        self.backbone = timm.create_model(
            'efficientnet_b3',
            pretrained=pretrained,
            num_classes=0,
            global_pool=''
        )
        num_features = 1536

        self.global_pool = nn.AdaptiveAvgPool2d(1)

        self.classifier = nn.Sequential(
            nn.Linear(num_features, 512),
            nn.ReLU(inplace=True),
            nn.Dropout(p=dropout),

            nn.Linear(512, 256),
            nn.ReLU(inplace=True),
            nn.Dropout(p=dropout * 0.75),

            nn.Linear(256, num_classes)
        )

    def forward(self, x):
        features = self.backbone(x)
        pooled = self.global_pool(features).flatten(1)
        logits = self.classifier(pooled)
        return logits, features
