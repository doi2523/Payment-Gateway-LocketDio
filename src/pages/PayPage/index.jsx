import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle, Copy, TriangleAlert, XCircle, X } from "lucide-react";
import VietQRImage from "./QrCodeImage";
import LoadingPage from "../../components/Loading";
import { CancelToOrder, GetInfoOrder } from "../../services";
import { showSuccess, showWarning } from "../../components/Toast";

export default function PayPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [plan, SetOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingRecheck, setLoadingRecheck] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    const fetchPlan = async () => {
      try {
        const data = await GetInfoOrder(orderId);
        SetOrder(data);
      } catch (error) {
        console.error("Lỗi khi lấy gói:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [orderId]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup khi component unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  const recheckOrder = async () => {
    setLoadingRecheck(true);
    try {
      const data = await GetInfoOrder(orderId);
      if (data?.status === "PENDING") {
        showWarning("⏳ Đơn hàng chưa được thanh toán.");
      } else if (data?.status === "PAID") {
        showSuccess("✅ Đơn hàng đã thanh toán thành công!");
      } else if (data?.status === "CANCELLED") {
        showWarning("❌ Đơn hàng đã bị huỷ.");
      } else {
        showWarning("⚠️ Trạng thái đơn hàng không xác định.");
      }
      SetOrder(data);
    } catch (error) {
      showWarning("⚠️ Không thể kiểm tra đơn hàng. Vui lòng thử lại.");
    } finally {
      setLoadingRecheck(false);
    }
  };

  const handleCancelOrder = async ({ orderId, orderCode, onSuccess }) => {
    const confirmCancel = window.confirm(
      "Bạn có chắc chắn muốn huỷ giao dịch không?"
    );
    if (!confirmCancel) return;

    try {
      await CancelToOrder(orderId, orderCode);
      alert("✅ Giao dịch đã được huỷ.");
      setTimeout(() => {
        window.location.reload(); // reload sau 2 giây
      }, 2000);
    } catch (error) {
      alert("❌ Không thể huỷ giao dịch. Vui lòng thử lại.");
    }
  };

  if (loading) return <LoadingPage isLoading={true} />;

  if (!plan || !["PENDING", "PAID", "CANCELLED"].includes(plan.status)) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-sm text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-red-100 p-3 rounded-full text-red-600">
              <TriangleAlert className="w-6 h-6" />
            </div>
          </div>
          <p className="text-md font-bold text-gray-800">
            Đơn hàng không tồn tại hoặc đã bị huỷ!
          </p>
        </div>
      </div>
    );
  }

  if (plan.status === "CANCELLED") {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-sm text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-red-100 p-3 rounded-full text-red-600">
              <TriangleAlert className="w-6 h-6" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            Đơn hàng đã bị huỷ
          </h2>
          <p className="text-sm text-gray-600">
            Đơn hàng này không thể tiếp tục thanh toán. Vui lòng chọn gói khác
            để tiếp tục.
          </p>
          {/* <button
      onClick={() => navigate("/pricing")}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
    >
      Quay lại chọn gói khác
    </button> */}
        </div>
      </div>
    );
  }

  if (plan.status === "PAID") {
    return (
      <div className="flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-sm text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-green-100 p-3 rounded-full text-green-600">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-green-700">
            🎉 Thanh toán thành công
          </h2>
          <p className="text-sm text-gray-600">
            Cảm ơn bạn đã thanh toán. Gói của bạn đã được kích hoạt.
          </p>
          {/* <button
      onClick={() => navigate("/dashboard")}
      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition"
    >
      Xem gói của bạn
    </button> */}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-white shadow-lg rounded-2xl p-6">
        {/* Cột bên trái - QR Code */}
        <div className="flex flex-col justify-start items-center space-y-4">
          <h2 className="text-lg font-semibold text-center">
            Quét mã QR để thanh toán
          </h2>
          <VietQRImage qrcode={plan} />

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 transition"
          >
            <CheckCircle className="w-4 h-4" />
            Xem chi tiết đơn hàng
          </button>
        </div>

        {/* Cột bên phải - Thông tin chuyển khoản */}
        <div className="flex flex-col justify-between space-y-4 text-sm">
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-center">
              Thông tin chuyển khoản
            </h2>

            {/* Ngân hàng */}
            <div className="flex items-center gap-2">
              <img
                src="https://api.vietqr.io/img/MB.png"
                alt="MB"
                className="h-6"
              />
              <div>
                <p className="text-xs text-gray-500">Ngân hàng</p>
                <p className="text-sm font-medium">
                  Ngân hàng TMCP Quân đội (MB Bank)
                </p>
              </div>
            </div>

            {/* Tên chủ tài khoản */}
            <div>
              <p className="text-xs text-gray-500">Chủ tài khoản</p>
              <p className="text-sm font-semibold text-primary">
                {plan.bank_info.account_name}
              </p>
            </div>

            {/* Các thông tin: STK, Số tiền, Nội dung */}
            {["accountNumber", "price", "description"].map((field) => {
              const labelMap = {
                accountNumber: "Số tài khoản",
                price: "Số tiền",
                description: "Nội dung",
              };
              const value =
                field === "accountNumber"
                  ? plan.bank_info.account_number
                  : field === "price"
                  ? `${plan.price.toLocaleString()} VND`
                  : plan?.transfer_content;

              return (
                <div key={field}>
                  <p className="text-xs text-gray-500">{labelMap[field]}</p>
                  <div className="flex items-center justify-between bg-gray-100 rounded-md pr-3 py-2.5 px-2">
                    <span className="font-medium text-primary">{value}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          field === "price" ? plan.price.toString() : value
                        );
                        setCopied(field);
                        setTimeout(() => setCopied(false), 1500);
                      }}
                      className="text-sm text-primary"
                    >
                      <Copy className="inline w-4 h-4 mr-1" />
                      Sao chép
                    </button>
                  </div>
                  {copied === field && (
                    <p className="text-xs text-green-600 mt-1">✓ Đã sao chép</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Lưu ý */}
          <div className="bg-yellow-50 text-yellow-800 border border-yellow-200 p-3 rounded-md text-xs space-y-1">
            <strong>Lưu ý:</strong> Nhập chính xác <strong>số tiền</strong> và{" "}
            <strong>nội dung</strong> để hệ thống tự động xử lý.
            <p>
              • Xử lý trong <strong>5-10 phút</strong>.
            </p>
            <p>
              • Cần hỗ trợ?{" "}
              <a
                href="https://zalo.me/0329254203"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Zalo CSKH
              </a>
            </p>
          </div>

          {/* Nút thao tác */}
          <div className="flex flex-col md:flex-row gap-2 pt-2 w-full">
            <button
              onClick={() =>
                handleCancelOrder({
                  orderId: plan.id,
                  orderCode: plan.info_order.orderCode,
                })
              }
              className="flex-1 flex items-center justify-center gap-2 border border-red-500 text-red-500 hover:bg-red-100 transition rounded px-3 py-2 text-sm"
            >
              <XCircle className="w-4 h-4" />
              <span>Huỷ giao dịch</span>
            </button>
            <button
              disabled={loadingRecheck}
              onClick={recheckOrder}
              className={`flex-1 rounded px-3 py-2 text-sm font-medium text-white transition ${
                loadingRecheck
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loadingRecheck ? "Đang kiểm tra..." : "Kiểm tra thanh toán"}
            </button>
          </div>
        </div>
      </div>
      <div
        className={`fixed inset-0 z-[70] flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all duration-300 p-4 ${
          showModal
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative transform transition-all duration-300 ${
            showModal ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-semibold mb-4 text-center">
            🧾 Chi tiết đơn hàng
          </h3>
          <div className="text-sm space-y-2">
            <div>
              <span className="font-medium">Mã đơn:</span>{" "}
              {plan?.id}
            </div>
            <div>
              <span className="font-medium">Khách hàng:</span>{" "}
              {plan.user_info?.display_name}
            </div>
            <div>
              <span className="font-medium">Email:</span> {plan.user_info?.email}
            </div>
            <div>
              <span className="font-medium">Gói:</span> {plan.plan_name} (
              {plan.billing_cycle})
            </div>
            <div>
              <span className="font-medium">Số tiền:</span>{" "}
              {plan.price.toLocaleString()} VND
            </div>
            <div>
              <span className="font-medium">Ngày tạo:</span>{" "}
              {new Date(plan.created_at).toLocaleString("vi-VN")}
            </div>
            <div>
              <span className="font-medium">Checkout URL:</span>{" "}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(plan.checkout_url);
                  setCopied("checkout_url");
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="text-blue-600 underline hover:text-blue-800 transition text-sm"
              >
                Nhấp để sao chép
              </button>
              {copied === "checkout_url" && (
                <p className="text-xs text-green-600 mt-1">✓ Đã sao chép</p>
              )}
            </div>

            <div>
              <span className="font-medium">Trạng thái:</span>{" "}
              <span
                className={`font-semibold ${
                  plan.status === "PENDING"
                    ? "text-yellow-500"
                    : plan.status === "PAID"
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {plan.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
