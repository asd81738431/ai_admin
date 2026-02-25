from tortoise import fields
from tortoise.models import Model


class Order(Model):
    id = fields.IntField(pk=True, auto_increment=True)
    order_num = fields.CharField(max_length=255)
    user_id = fields.IntField()
    user_name = fields.CharField(max_length=255)
    amount = fields.CharField(max_length=255)
    status = fields.CharField(max_length=50, default="active")
    createdAt = fields.DatetimeField(auto_now_add=True)
    updatedAt = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "order"
