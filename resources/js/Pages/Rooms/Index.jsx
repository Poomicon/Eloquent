import React, { useState } from 'react';
import { usePage, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Swal from 'sweetalert2'; // Import SweetAlert2

export default function Index() {
  const { bookings = [] } = usePage().props;
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBookings = bookings.filter(booking =>
    [booking.customer_name, booking.customer_phone, booking.room_number]
      .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto p-8 bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">รายการการจองที่พัก</h2>

        {/* ช่องค้นหา */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="ค้นหาด้วยชื่อลูกค้า หมายเลขโทรศัพท์ หรือหมายเลขห้อง"
            className="border px-4 py-2 w-1/2 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredBookings.length > 0 ? (
          <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                <th className="py-3 px-4 text-left font-semibold">ชื่อของลูกค้า</th>
                <th className="py-3 px-4 text-left font-semibold">หมายเลขโทรศัพท์</th>
                <th className="py-3 px-4 text-left font-semibold">หมายเลขห้อง</th>
                <th className="py-3 px-4 text-left font-semibold">สถานะห้อง</th>
                <th className="py-3 px-4 text-left font-semibold">วันที่เช็คอิน</th>
                <th className="py-3 px-4 text-left font-semibold">วันที่เช็คเอาท์</th>
                <th className="py-3 px-4 text-left font-semibold">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking, index) => (
                <tr key={index} className="border-b hover:bg-gray-100 odd:bg-gray-50">
                  <td className="py-3 px-4">{booking.customer_name ?? "ไม่ระบุ"}</td>
                  <td className="py-3 px-4">{booking.customer_phone ?? "ไม่ระบุ"}</td>
                  <td className="py-3 px-4">{booking.room_number ?? "ไม่ระบุ"}</td>
                  <td className="py-3 px-4">{booking.room_status === 'not_reserved' ? 'reserved' : booking.room_status}</td>
                  <td className="py-3 px-4">{booking.check_in_date ? new Date(booking.check_in_date).toLocaleDateString() : "ไม่ระบุ"}</td>
                  <td className="py-3 px-4">{booking.check_out_date ? new Date(booking.check_out_date).toLocaleDateString() : "ไม่ระบุ"}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Link
                        href={`/rooms/${booking.id}/edit`}
                        className="bg-yellow-500 text-white px-4 py-1 rounded-2xl shadow hover:bg-yellow-600"
                      >
                        แก้ไข
                      </Link>
                      <button
                        onClick={() => handleDelete(booking.id)}
                        className="bg-red-500 text-white px-4 py-1 rounded-2xl shadow hover:bg-red-600"
                      >
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center py-6 text-gray-500">ไม่มีข้อมูลการจอง</p>
        )}
      </div>
    </AuthenticatedLayout>
  );

  function handleDelete(id) {
    Swal.fire({
      title: 'คุณต้องการลบการจองนี้หรือไม่?',
      text: "การลบไม่สามารถย้อนกลับได้",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(`/rooms/${id}`, {
          onSuccess: () => Swal.fire('ลบสำเร็จ!', 'การจองถูกลบแล้ว', 'success'),
        });
      }
    });
  }
}
