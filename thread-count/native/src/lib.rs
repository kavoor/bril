#[macro_use]
extern crate neon;
extern crate num_cpus;

use neon::prelude::*;


//cx.number expects an f64
fn thread_count(mut cx: FunctionContext) -> JsResult<JsNumber> {
    Ok(cx.number(num_cpus::get() as f64))
}

fn add(mut cx: FunctionContext) -> JsResult<JsNumber> {
    let a = 8 as f64;
    let b = 10 as f64;
    Ok(cx.number(a + b))
}
register_module!(mut m, {
    // m.export_function("threadCount", thread_count)
    m.export_function("add", add)
});
