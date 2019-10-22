extern crate core;
use core::arch::x86_64::*;

#[no_mangle]
pub fn add(first: i32, second:i32) -> i32 {
 first + second
}

#[no_mangle]
pub fn vadd(a0: i32, a1: i32, a2: i32, a3: i32, b0: i32, b1: i32, b2: i32, b3: i32, memc: *mut i32) -> i32 {
    unsafe {
        let a = _mm_set_epi32(a0, a1, a2, a3);
        let b = _mm_set_epi32(b0, b1, b2, b3);
        let c = _mm_add_epi32(a, b);
        // *memc = 10;
        // _mm_storeu_si128(memc as *mut _ , c);
        // memc
        0
    }
}

