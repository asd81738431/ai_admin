from tortoise import fields
from tortoise.models import Model


class Product(Model):
    id = fields.IntField(pk=True, auto_increment=True)
    name = fields.CharField(max_length=255)
    category = fields.CharField(max_length=255)
    amount = fields.IntField()
    num = fields.IntField()
    status = fields.CharField(max_length=50)
    createdAt = fields.DatetimeField(auto_now_add=True)
    updatedAt = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "product"
