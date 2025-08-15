export var UserType;
(function (UserType) {
    UserType["Client"] = "client";
    UserType["Driver"] = "driver";
    UserType["Admin"] = "admin";
})(UserType || (UserType = {}));
export var OrderStatus;
(function (OrderStatus) {
    OrderStatus["Pending"] = "pending";
    OrderStatus["Accepted"] = "accepted";
    OrderStatus["EnRoute"] = "enroute";
    OrderStatus["Delivered"] = "delivered";
    OrderStatus["Canceled"] = "canceled";
})(OrderStatus || (OrderStatus = {}));
